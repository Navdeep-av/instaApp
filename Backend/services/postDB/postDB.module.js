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
export const postsDataModel = model("InstaFeedsData", postSchema);
