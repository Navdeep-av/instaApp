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
        position: "bottom-center",
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
        <div>
          <span>...</span>
        </div>
      </div>
      <div
        style={{
          backgroundColor: "#e7e7e7",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <img
          src={`/assets/${images[imageNum]}.jpg`}
          className="w-[400px] h-[595]"
          alt=""
        />
        <h3>id: {data.id}</h3>
        <h3>Name: {data.name}</h3>
        <h4>Image: {data.imageLink}</h4>

        <h4>
          {isLike ? (
            <button
              className="material-symbols-outlined cursor-pointer"
              onClick={() => onLikeButtonClick(data.id, true)}
            >
              <img src={`/assets/black-like.png`} alt="" className="w-5" />
            </button>
          ) : (
            <button
              className="cursor-pointer"
              onClick={() => onLikeButtonClick(data.id, false)}
            >
              <img src={`/assets/filled-like.png`} alt="" className="w-5" />
            </button>
          )}
          <span>{likesCount}</span>
        </h4>
        <h4>Comment: {data.commentsCount}</h4>
        <ToastContainer />
      </div>
    </>
  );
};

export default PostCards;
