import express from "express";
import { connectDB } from "./services/postDB/postDB.services.js";
import { postsDataModel } from "./services/postDB/postDB.module.js";
import cors from "cors";
import { PORT } from "./app.config.js";

const app = express();
app.use(cors());
app.use(express.json());
connectDB();

function generateData(numEntries) {
  const data = [];
  for (let i = 0; i < numEntries; i++) {
    data.push({
      id: i + 1,
      name: `Items ${i + 1}`,
      postLink: `PostLink ${i + 1}`,
      imageLink: `ImageLink ${i + 1}`,
      likesCount: Math.floor(Math.random() * 100),
      likesUserList: [],
      commentsCount: Math.floor(Math.random() * 100),
    });
  }
  return data;
}

app.get("/posts", async (req, res) => {
  const { offset, limit } = req.query;
  // console.log("Offset", offset, typeof offset);
  // console.log("limit", limit, typeof limit);
  console.log("inside API Hit");

  const savedPosts = await postsDataModel.find().skip(offset).limit(limit);

  res.json({ posts: savedPosts });
});

app.get("/generatedata", async (req, res) => {
  let generatedData = generateData(20000);

  const savedPosts = await postsDataModel.insertMany(generatedData);
  console.log("Post", savedPosts);
  res.json(savedPosts);
});

app.get("/find", async (req, res) => {
  const savedPosts = await postsDataModel.find().skip(3).limit(3);
  console.log("Post", savedPosts);
  res.json(savedPosts);
});

app.post("/likeupdate", async (req, res) => {
  const { id, isLiked, credentials } = req.body;
  console.log("id", id);
  console.log("like", isLiked);
  console.log("cred", credentials);
  const likeValue = isLiked ? 1 : -1;

  console.log("id", id);
  const updateLikes = isLiked
    ? await postsDataModel.updateOne(
        { id },
        {
          $inc: { likesCount: likeValue },
          $push: { likesUserList: credentials },
        }
      )
    : await postsDataModel.updateOne(
        { id },
        {
          $inc: { likesCount: likeValue },
          $pull: { likesUserList: credentials },
        }
      );
  console.log(updateLikes);
  res.json(updateLikes);
});

app.get("/getlikes", async (req, res) => {
  const { userEmail } = req.query;

  console.log("cre", userEmail);
  const getLikesList = await postsDataModel.find({
    likesUserList: { $elemMatch: { $eq: userEmail } },
  });
  res.send(getLikesList);
  console.log("getLikes", getLikesList);
});

app.post("/commentInfo", async (req, res) => {
  const { postID, text, userEmail } = req.body;
  console.log("postID", postID);
  const updateComment = await postsDataModel.updateOne(
    { id: postID },
    {
      $push: {
        commentInfo: {
          emailID: userEmail,
          comment: text,
        },
      },
    }
  );

  console.log(updateComment);
  res.json(updateComment);
});

app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`);
});
