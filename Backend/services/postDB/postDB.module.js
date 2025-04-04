import { model, Schema } from "mongoose";

// Define Schema
console.log("Here 1");
const postSchema = Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    postLink: { type: String, required: true },
    postCaption: { type: String, required: true },
    imageLink: { type: String },
    likesCount: { type: Number },
    likesUserList: [{ type: String }],
    commentsCount: { type: String },
    commentInfo: [
      {
        emailID: String,
        comment: String,
        commentLikesUserList: [{ type: String }],
        nestedComment: [
          {
            nestedEmailID: String,
            nestedComment: String,
            nestedCommentLikes: { type: Number },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
    strict: false,
  }
);
console.log("Here 2");
// Define a Model
export const postsDataModel = model("instapostsdatas", postSchema);
