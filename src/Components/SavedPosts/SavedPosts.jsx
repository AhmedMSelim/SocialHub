import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import PostCard from "../PostCard/PostCard";

export default function SavedPosts() {
  function getSavedPosts() {
    return axios.get(`https://route-posts.routemisr.com/users/bookmarks`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
    });
  }
  const { data } = useQuery({
    queryKey: ["getSavedPosts"],
    queryFn: getSavedPosts,
  });
  return (
    <>
      {data?.data?.data?.bookmarks?.length > 0 ? (
        data?.data?.data?.bookmarks?.map((post) => (
          <PostCard
            key={post._id}
            isPostDetails={false}
            post={post}
            className="bg-gray-100 mt-2 rounded-2xl w-full bordershadow-sm hover:shadow-md transition"
          />
        ))
      ) : (
        <article className="rounded-2xl border mt-4 bg-white shadow-sm hover:shadow-md transition">
          <p className="text-center text-gray-500 py-10">
            "No saved posts yet ⭐"
          </p>
        </article>
      )}
    </>
  );
}
