import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import PostCard from "../PostCard/PostCard";
import Loader from "../Loader/Loader";
import { useQuery } from "@tanstack/react-query";
import PostCreation from "../PostCreation/PostCreation";
import SidebarNavigation from "../SidebarNavigation/SidebarNavigation";
import SuggestedFriends from "../SuggestedFriends/SuggestedFriends";
import SavedPosts from "./../SavedPosts/SavedPosts";
import { MyPostsContext } from "../../Context/MyPostsContext.jsx";

export default function Home() {
  // const [allPosts, setAllPosts] = useState(null);
  // const [isLoading, setIsLoading] = useState(true);
  // const [isError, setIsError] = useState(false);
  const [activeTab, setActiveTab] = useState("community");
  const userId = JSON.parse(localStorage.getItem("user"))._id;
  const { getMyPosts, setGetMyPosts } = useContext(MyPostsContext);

  function getAllPosts() {
    return axios.get(`https://route-posts.routemisr.com/posts`, {
      params: { sort: "-createdAt" },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
    // .then((res) => {
    //   if (res.data.message === "success") {
    //     // console.log(res.data.data.posts);
    //     setAllPosts(res.data.data.posts);
    //   }
    // })
    // .catch((err) => {
    //   // console.log(err);
    //   setIsError(true);
    // })
    // .finally(setIsLoading(false));
  }

  // useEffect(() => {
  //   getAllPosts();
  // }, []);

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["getAllPosts"],

    queryFn: getAllPosts,
    // refetchOnMount: true, // if make it false dont refetch agian
    // refetchInterval: 1000 * 60 * 60 * 24 * 365, // reFetch every condition
    // retry: 3 // reFetch if has error
    // retryDelay: 2000 // retry ms
    // staleTime: 8000 // fresh
    // enabled: true // if truw fetch mount
  });

  function myPosts() {
    return axios.get(
      `https://route-posts.routemisr.com/users/${userId}/posts`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { data: userPosts } = useQuery({
    queryKey: ["myPosts"],
    queryFn: myPosts,
    enabled: !!userId,
  });
  const userPostsProfile = userPosts?.data?.data?.posts;
  useEffect(() => {
    if (userPostsProfile) {
      setGetMyPosts(userPostsProfile);
      localStorage.setItem("getMyPosts", JSON.stringify(userPostsProfile));
    }
  }, [userPostsProfile]);

  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return (
      <div className="min-h-screen flex justify-center items-center ">
        <h1 className="text-2xl font-bold text-red-500">
          Something went wrong, please try again later.
        </h1>
      </div>
    );
  }
  return (
    <>
      <div className="flex flex-wrap gap-6 mt-6 md:flex-nowrap">
        <SidebarNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="w-full md:w-2/4 ">
          <PostCreation />
          {activeTab === "community" &&
            data.data.data.posts?.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                className="rounded-2xl border mt-3 border-slate-200 bg-gray-100 shadow-sm"
              />
            ))}

          {activeTab === "feed" ? (
            userPostsProfile?.length > 0 ? (
              userPostsProfile?.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  className="rounded-2xl border mt-3 border-slate-200 bg-gray-100 p-4 shadow-sm"
                />
              ))
            ) : (
              <article className="rounded-2xl border mt-5 bg-white shadow-sm hover:shadow-md transition">
                <p className="text-center text-gray-500 py-10">
                  "No posts yet ⭐"
                </p>
              </article>
            )
          ) : null}
          {activeTab === "my-posts" ? (
            userPostsProfile?.length > 0 ? (
              userPostsProfile?.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  className="rounded-2xl border mt-3 border-slate-200 bg-gray-100 p-4 shadow-sm transition"
                />
              ))
            ) : (
              <article className="rounded-2xl border mt-5 bg-white shadow-sm hover:shadow-md transition">
                <p className="text-center text-gray-500 py-10">
                  "No posts yet ⭐"
                </p>
              </article>
            )
          ) : null}
          {activeTab === "saved" && <SavedPosts />}
        </div>
        <SuggestedFriends />
      </div>
    </>
  );
}
