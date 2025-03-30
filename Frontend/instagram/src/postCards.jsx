import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

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
  console.log("Cred", credentials);
  console.log("likedPosts", likedPosts);
  const [imageNum, setImageNum] = useState(0);
  const [likesCount, setLikesCount] = useState(data.likesCount);
  const [isLike, setIsLike] = useState(true);
  const [commentValue, setCommentValue] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (imageNum === 10) {
      setImageNum(0);
    } else {
      setImageNum((prev) => prev + 1);
    }
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
      } catch (err) {
        console.log(err);
      }

      setCommentValue("");
    }
  };

  console.log("Commenrs", comments);

  return (
    <>
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
          className="w-[400px] h-[595]"
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
            <button className="material-symbols-outlined cursor-pointer">
              <img src={`/assets/chat.png`} alt="" className="w-5" />
            </button>
          </div>
        </div>

        <span className="text-sm font-medium">{likesCount} likes</span>
        <p className="leading-[19px] text-sm mt-1">
          <span className="font-medium"> {data.name} </span>

          <span className="text-sm font-[Segoe UI]">
            {data.postCaption} <span className="text-[#737373]">more</span>
          </span>
        </p>
        <p className="text-[12px] text-[#737373] mt-[6px]">
          View all {data.commentsCount} comments
        </p>
        {comments &&
          comments
            .reverse()
            .slice(0, 3)
            .map((item) => (
              <div>
                <span className="text-[12px] font-medium mt-[5px]">
                  {data.name}{" "}
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
              className="placeholder:text-[#737373] placeholder:text-xs w-[100%] pb-[7px] border-b-[1px] border-[#dbdbdb] mt-2"
            />
          )}
        </p>

        <ToastContainer />
      </div>
    </>
  );
};

export default PostCards;
