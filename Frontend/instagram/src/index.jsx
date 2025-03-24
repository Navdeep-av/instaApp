import { useEffect, useState } from "react";
import axios from "axios";
import { useRef } from "react";
import { useCallback } from "react";
import PostCards from "./postCards";
import CheckAuth from "./outh";
import { googleLogout } from "@react-oauth/google";

const InstaUi = () => {
  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(2);
  const loadRef = useRef(null);
  const [isAuth, setIsAuth] = useState(false);
  const [credentials, setCredentials] = useState();
  const [likedPosts, setLikedPosts] = useState([]);

  const handleLogin = async (googleCred) => {
    setCredentials(googleCred.email);
    const userEmail = googleCred.email;
    console.log("useremial", userEmail);
    try {
      const response = await axios.get("http://localhost:2100/getlikes", {
        params: {
          userEmail,
        },
      });
      const likedPostsId = response.data.map((item) => item.id);

      setLikedPosts(likedPostsId);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchData = useCallback(async () => {
    console.log("Inside Fetch Data");
    try {
      const response = await axios.get(
        `http://localhost:2100/posts?offset=${index}&limit=2`
      );
      const data = response.data.posts;
      setItems((prevData) => [...prevData, ...data]);
      setIndex((prevIndex) => prevIndex + 2);
    } catch (err) {
      console.log(err);
    }
  }, [index]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchData();
      }
    });

    if (loadRef.current) {
      observer.observe(loadRef.current);
    }
    return () => {
      if (loadRef.current) {
        observer.unobserve(loadRef.current);
      }
    };
  }, [fetchData]);

  useEffect(() => {
    console.log("Inside Initial Data");
    const fetchInitialData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:2100/posts?offset=0&limit=2`
        );
        setItems(response.data.posts);
      } catch (err) {
        console.log("Err", err);
      }
    };

    fetchInitialData();
  }, []);

  const logout = () => {
    googleLogout();
  };

  console.log("Items", isAuth);

  return (
    <>
      <div className="flex items-center justify-between w-full">
        <div className="w-1/3">
          {" "}
          <img
            src={"/assets/Instagram-Logo-2016-present.png"}
            className="w-[111px] "
            alt=""
          />
        </div>
        <div className="w-1/3 text-center">
          {" "}
          <img src={"/assets/insta-story.jpg"} alt="" />
        </div>
        <div className="w-1/3 text-right">
          <>
            {isAuth ? (
              <>
                <button onClick={logout}>LogoutV2</button>
              </>
            ) : (
              <a className="cursor-pointer" onClick={() => setIsAuth(true)}>
                Login
              </a>
            )}
            {isAuth && <CheckAuth onLoginSuccess={handleLogin} />}
          </>
        </div>
      </div>
      <div className="block"></div>
      <div className="flex justify-center">
        <div className="w-96">
          {items.length > 0 ? (
            items.map((item) => {
              return (
                <PostCards
                  data={item}
                  key={item.id}
                  likedPosts={likedPosts}
                  credentials={credentials}
                />
              );
            })
          ) : (
            <h3>Loading</h3>
          )}
        </div>
      </div>
      <div ref={loadRef}></div>
    </>
  );
};

export default InstaUi;
