import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const images = [
  "",
  "Nature-1",
  "Nature-2",
  "Nature-3",
  "Nature4",
  "Nature5",
  "Nature6",
  "Nature7",
  "Nature8",
  "Nature9",
  "Nature10",
];

const PostCards = ({ data, likedPosts, credentials }) => {
  console.log("Data", data);
  const [imageNum, setImageNum] = useState(0);
  const [likesCount, setLikesCount] = useState(data.likesCount);
  const [isLike, setIsLike] = useState(true);
  const [commentValue, setCommentValue] = useState("");
  const [comments, setComments] = useState(data.commentInfo);
  const [open, setOpen] = React.useState(false);
  const [commentCount, setCommentCount] = useState();

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (imageNum === 10) {
      setImageNum(0);
    } else {
      setImageNum((prev) => prev + 1);
    }
    setCommentCount(data.commentInfo.length);
  }, []);

  useEffect(() => {
    if (likedPosts.includes(data.id)) {
      setIsLike(false);
    } else {
      setIsLike(true);
    }
  }, [likedPosts]);

  const onLikeButtonClick = async (id, isLiked) => {
    if (!credentials) {
      toast.error("Please Login First", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }
    console.log("id", id);
    console.log("IsLike", isLiked);
    if (isLiked) {
      setLikesCount((prev) => prev + 1);
      setIsLike(false);
    } else {
      setLikesCount((prev) => prev - 1);
      setIsLike(true);
    }

    try {
      const response = await axios.post("http://localhost:2100/likeupdate", {
        id,
        isLiked,
        credentials,
      });
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleComment = (e, id) => {
    setCommentValue(e.target.value);
    console.log(id);
  };

  const handleCommentKey = async (e, id) => {
    if (commentValue.length > 0 && e.key === "Enter") {
      console.log("ID Comment", id);
      try {
        const response = await axios.post("http://localhost:2100/commentInfo", {
          postID: id,
          text: commentValue,
          userEmail: credentials,
        });
        setComments(response.data.commentInfo);
        setCommentCount(response.data.commentInfo.length);
      } catch (err) {
        console.log(err);
      }

      setCommentValue("");
    }
  };

  console.log("Commenrs", comments);

  console.log("Length", data.commentInfo);

  return (
    <>
      <BootstrapDialog
        onClose={handleClose}
        fullScreen={false}
        maxWidth={"lg"}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <div className="flex">
          <div>
            <img src={`/assets/${images[imageNum]}.jpg`} alt="" />
          </div>
          <div className="p-3">
            <div className="flex items-center border-b-[1px] border-[#dbdbdb] pb-2">
              <div>
                <img
                  src={`/assets/${images[imageNum]}.jpg`}
                  className="w-[32px] h-[32px] rounded-full"
                  alt=""
                />
              </div>
              <span className="text-black text-[12px] font-medium ml-2">
                {data.name}
              </span>
              <img
                src={`/assets/blue_tick.png`}
                className="w-[12px] h-[12px] ml-[3px]"
                alt=""
              />
            </div>
            <p className="leading-[17px] text-sm mt-2">
              <span className="font-medium text-[12px]"> {data.name} </span>

              <span className="text-[12px] font-[Segoe UI]">
                {data.postCaption} <span className="text-[#737373]">more</span>
              </span>
            </p>
            <p>
              {comments &&
                comments.map((item) => (
                  <div>
                    <span className="text-[12px] font-medium mt-[5px]">
                      {item.emailID}{" "}
                    </span>{" "}
                    <span className="text-[12px]">{item.comment}</span>
                  </div>
                ))}
            </p>
            <div className="flex items-center">
              <div className="mt-2">
                {" "}
                {isLike ? (
                  <button
                    className="material-symbols-outlined cursor-pointer"
                    onClick={() => onLikeButtonClick(data.id, true)}
                  >
                    <img
                      src={`/assets/black-like.png`}
                      alt=""
                      className="w-6"
                    />
                  </button>
                ) : (
                  <button
                    className="cursor-pointer"
                    onClick={() => onLikeButtonClick(data.id, false)}
                  >
                    <img
                      src={`/assets/filled-like.png`}
                      alt=""
                      className="w-6"
                    />
                  </button>
                )}
              </div>
              <p className="text-[12px] font-medium">{likesCount} likes</p>
            </div>

            <p>
              {credentials && (
                <input
                  type="text"
                  placeholder="Add a comment..."
                  onChange={(e) => handleComment(e, data.id)}
                  onKeyUp={(e) => handleCommentKey(e, data.id)}
                  value={commentValue}
                  className="text-xs placeholder:text-[#737373] placeholder:text-xs w-[100%] pb-[7px] border-b-[1px] border-[#dbdbdb] mt-2 focus:border-b-2 focus:border-[#000] outline-none"
                />
              )}
            </p>
          </div>
        </div>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
      </BootstrapDialog>

      <div className="flex items-center">
        <div>
          <img
            src={`/assets/${images[imageNum]}.jpg`}
            className="w-[32px] h-[32px] rounded-full"
            alt=""
          />
        </div>
        <div>
          <span className="text-black text-sm font-medium ml-1">
            {data.name}
          </span>
        </div>
        <div>
          <img
            src={`/assets/blue_tick.png`}
            className="w-[12px] h-[12px] ml-[3px]"
            alt=""
          />
        </div>
      </div>

      <div
        style={{
          padding: "8px",
          marginBottom: "20px",
        }}
      >
        <img
          src={`/assets/${images[imageNum]}.jpg`}
          className="w-[400px] h-[480px]"
          alt=""
        />
        <div className="flex items-center">
          <div className="mt-2">
            {" "}
            {isLike ? (
              <button
                className="material-symbols-outlined cursor-pointer"
                onClick={() => onLikeButtonClick(data.id, true)}
              >
                <img src={`/assets/black-like.png`} alt="" className="w-6" />
              </button>
            ) : (
              <button
                className="cursor-pointer"
                onClick={() => onLikeButtonClick(data.id, false)}
              >
                <img src={`/assets/filled-like.png`} alt="" className="w-6" />
              </button>
            )}
          </div>
          <div className="mt-2 ml-3">
            <button
              className="material-symbols-outlined cursor-pointer"
              onClick={handleClickOpen}
            >
              <img src={`/assets/chat.png`} alt="" className="w-5" />
            </button>
          </div>
        </div>

        <span className="text-[12px] font-medium">{likesCount} likes</span>
        <p className="leading-[17px] text-sm mt-1">
          <span className="font-medium text-[12px]"> {data.name} </span>

          <span className="text-[12px] leading-[0.25rem] font-[Segoe UI]">
            {data.postCaption} <span className="text-[#737373]">more</span>
          </span>
        </p>
        <p
          className="text-[12px] text-[#737373] mt-[6px] cursor-pointer"
          onClick={handleClickOpen}
        >
          View all {commentCount} comments
        </p>
        {comments &&
          credentials &&
          comments
            .reverse()
            .slice(0, 3)
            .map((item) => (
              <div>
                <span className="text-[12px] font-medium mt-[5px]">
                  {item.emailID}{" "}
                </span>{" "}
                <span className="text-[12px]">{item.comment}</span>
              </div>
            ))}

        <p>
          {credentials && (
            <input
              type="text"
              placeholder="Add a comment..."
              onChange={(e) => handleComment(e, data.id)}
              onKeyUp={(e) => handleCommentKey(e, data.id)}
              value={commentValue}
              className="text-xs placeholder:text-[#737373] placeholder:text-xs w-[100%] pb-[7px] border-b-[1px] border-[#dbdbdb] mt-2 focus:border-b-2 focus:border-[#000] outline-none"
            />
          )}
        </p>

        <ToastContainer />
      </div>
    </>
  );
};

export default PostCards;
