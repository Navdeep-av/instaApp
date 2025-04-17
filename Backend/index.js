import express from "express";
import { connectDB } from "./services/postDB/postDB.services.js";
import { postsDataModel } from "./services/postDB/postDB.module.js";
import cors from "cors";
import { PORT } from "./app.config.js";

import { Server } from "socket.io";
import http from "http";

const app = express();
// const io = new Server(server);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let globalIO = io;
io.on("connection", (socket) => {
  console.log("a user connected");
});

app.use(cors());
app.use(express.json());
connectDB();

function generateData(numEntries) {
  const data = [];
  for (let i = 0; i < numEntries; i++) {
    data.push({
      id: i + 1,
      name: `Items_${i + 1}`,
      postLink: `PostLink ${i + 1}`,
      imageLink: `ImageLink ${i + 1}`,
      postCaption:
        "A viral screenshot from the Turkish series Dirilis: Ertugrul featuring actor Cavit Cetin Guner has caught attention,...",
      likesCount: Math.floor(Math.random() * 100),
      likesUserList: [],
      commentsCount: Math.floor(Math.random() * 100),
    });
  }
  return data;
}

// for Infine Scrolling
app.get("/posts", async (req, res) => {
  const { offset, limit } = req.query;
  // console.log("Offset", offset, typeof offset);
  // console.log("limit", limit, typeof limit);

  const savedPosts = await postsDataModel.find().skip(offset).limit(limit);

  res.json({ posts: savedPosts });
});

app.get("/generatedata", async (req, res) => {
  let generatedData = generateData(20);

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

  globalIO.emit("postLiked", { postId: id, isLiked, credentials });

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

// Add/Update Post Comment
app.post("/commentInfo", async (req, res) => {
  const { postID, text, userEmail } = req.body;
  console.log("postID", postID);
  const updateComment = await postsDataModel.updateOne(
    { id: postID },
    {
      $push: {
        commentInfo: {
          $each: [
            {
              emailID: userEmail,
              comment: text,
            },
          ],
          $position: 0,
        },
      },
    }
  );

  const findComm = await postsDataModel.findOne({ id: postID });
  console.log("FindComm", findComm);

  res.json(findComm);
});

app.post("/nestedCommentInfo", async (req, res) => {
  const { postID, text, userEmail, commentID } = req.body;
  console.log("postID", postID);
  try {
    const updateComment = await postsDataModel.findOneAndUpdate(
      {
        id: postID,
        "commentInfo._id": commentID,
      },
      {
        $push: {
          "commentInfo.$.nestedComment": {
            nestedEmailID: userEmail,
            nestedComment: text,
            nestedCommentLikes: 0,
          },
        },
      },
      { new: true }
    );
    console.log("Nested Comm", updateComment);
    return res.status(200).json(updateComment);
  } catch (err) {
    console.log(err);
    return res.status(500).json(updateComment);
  }
});

app.post("/commentlikeupdate", async (req, res) => {
  const { postId, commentId, userEmail, isCommentLike } = req.body;
  console.log("IsCommentLIKE", isCommentLike);
  try {
    const updateLikes = await postsDataModel.findOneAndUpdate(
      { id: postId, "commentInfo._id": commentId },
      isCommentLike
        ? {
            $inc: { "commentInfo.$.commentLikesCount": 1 },
            $push: { "commentInfo.$.commentLikesUserList": userEmail },
          }
        : {
            $inc: { "commentInfo.$.commentLikesCount": -1 },
            $pull: { "commentInfo.$.commentLikesUserList": userEmail },
          },
      { new: true }
    );

    console.log(updateLikes);
    res.status(200).json(updateLikes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// app.get("/comminfo", async (req, res) => {
//   const findComm = await postsDataModel.findOne({ id: 2 });
//   console.log("FindComm", findComm);

//   res.json(findComm);
// });

server.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`);
});
