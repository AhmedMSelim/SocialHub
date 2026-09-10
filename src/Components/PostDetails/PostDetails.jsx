import axios from "axios";
import React from "react";
import { useParams } from "react-router-dom";
import Loader from "../Loader/Loader";
import { useQuery } from "@tanstack/react-query";
import PostCard from "../PostCard/PostCard";
import { Helmet } from "react-helmet-async";

export default function PostDetails() {
  const { id } = useParams();

  function getPostDetails() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["getPostDetails", id],

    queryFn: getPostDetails,
  });

  // console.log(data?.data.data.post);

  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h1 className="text-2xl font-bold text-red-500">
          Something went wrong, please try again later.
        </h1>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>PostDetails</title>
      </Helmet>
      <PostCard
        key={id}
        post={data?.data.data.post}
        isPostDetails
        className="md:w-125 sm:w-3xs mx-auto mt-6 bg-gray-100"
      />
    </>
  );
}
