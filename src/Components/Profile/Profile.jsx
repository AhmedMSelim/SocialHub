import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Camera,
  Maximize2,
  Users,
  Mail,
  FileText,
  Bookmark,
} from "lucide-react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import DefImage from "../../assets/download.jpeg";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import UploadImage from "../UploadImage/UploadImage.jsx";
import SavedPosts from "../SavedPosts/SavedPosts.jsx";
import PostCard from "../PostCard/PostCard.jsx";
import { MyPostsContext } from "../../Context/MyPostsContext.jsx";
import Loader from "./../Loader/Loader";
import { Helmet } from "react-helmet-async";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("my-posts");
  const [imageSrc, setimageSrc] = useState(null);
  const photoRef = useRef(null);
  const { getMyPosts } = useContext(MyPostsContext);

  function myProfile() {
    return axios.get(`https://route-posts.routemisr.com/users/profile-data`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
    });
  }

  const { data, isLoading } = useQuery({
    queryKey: ["myProfile"],
    queryFn: myProfile,
  });

  const handleImage = (e) => {
    e.target.files[0];
    setimageSrc(URL.createObjectURL(e.target.files[0]));
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container w-[98%] min-h-screen mx-auto p-4 space-y-6">
      <Helmet>
        <title>Profile</title>
      </Helmet>
      {/* Profile Header Section */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Cover Photo */}
        <div className="relative h-52 bg-gradient-to-r from-slate-900 to-blue-400">
          <label className="absolute right-3 top-3 flex items-center gap-1 bg-black/50 text-white px-3 py-1 rounded-lg text-xs cursor-pointer hover:bg-black/70 transition">
            <Camera size={14} />
            Add cover
            <input className="hidden" type="file" />
          </label>
        </div>

        {/* Profile Info Header */}
        <div className="relative -mt-16 p-5">
          <div className="bg-white p-6 rounded-3xl shadow">
            <div className="flex justify-between items-end flex-wrap gap-4">
              <div className="flex items-end gap-4">
                <div className="relative">
                  <img
                    className="w-28 h-28 rounded-full border-4 border-white object-cover"
                    src={data?.data.data.user.photo || DefImage}
                    alt={data?.data.data.user.name}
                  />
                  <button className="absolute bottom-1 left-1 bg-white p-2 rounded-full shadow hover:bg-slate-50">
                    <Maximize2 size={14} />
                  </button>
                  <label className="absolute bottom-1 right-1 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
                    <Camera size={14} />
                    <input
                      onChange={handleImage}
                      ref={photoRef}
                      accept="image/*"
                      hidden
                      type="file"
                    />
                  </label>
                </div>
                {imageSrc && (
                  <UploadImage
                    imageSrc={imageSrc}
                    setimageSrc={setimageSrc}
                    photoRef={photoRef}
                  />
                )}

                <div className="w-fit">
                  <h2 className="text-[14px] wrap-break-word md:text-2xl font-bold">
                    {data?.data.data.user.name}
                  </h2>
                  <p className="text-[10px] md:text-sm text-gray-500">
                    @{data?.data.data.user.username}
                  </p>
                  <div className="text-[10px] mt-2 flex items-center gap-1 text-blue-600 md:text-sm">
                    <Users size={14} />
                    SocialHub member
                  </div>
                </div>
              </div>

              {/* Stats Counters */}
              <div className="grid w-full grid-cols-3 gap-2 lg:w-[520px]">
                <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center sm:px-4 sm:py-4">
                  <p className="text-[8px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">
                    Followers
                  </p>
                  <p className="text-[20px] mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                    {data?.data.data.user.followersCount}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center sm:px-4 sm:py-4">
                  <p className="text-[8px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">
                    Following
                  </p>
                  <p className="text-[20px] mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                    {data?.data.data.user.followingCount}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center sm:px-4 sm:py-4">
                  <p className="text-[8px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">
                    Bookmarks
                  </p>
                  <p className="text-[20px] mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                    {data?.data.data.user.bookmarksCount}
                  </p>
                </div>
              </div>
            </div>

            {/* About & Quick Stats */}
            <div className="mt-5 grid gap-4 lg:grid-cols-[2fr_1fr]">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-extrabold text-slate-800">About</h3>
                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  <p className="flex items-center gap-2">
                    <Mail size={15} className="text-slate-500" />
                    {data?.data.data.user.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <LiaBirthdayCakeSolid
                      size={15}
                      className="text-slate-500"
                    />
                    {data?.data.data.user.dateOfBirth.split("T").slice(0, 1)}
                  </p>
                  <p className="flex items-center gap-2">
                    <Users size={15} className="text-slate-500" />
                    Active on SocialHub
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 rounded-2xl border border-[#dbeafe] bg-[#f6faff] px-4 py-3">
                <div className="rounded-2xl border border-[#dbeafe] bg-[#f6faff] px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#1f4f96]">
                    My posts
                  </p>
                  <p className="mt-1 text-2xl font-black text-slate-900">
                    {getMyPosts?.length || 0}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#dbeafe] bg-[#f6faff] px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#1f4f96]">
                    Saved posts
                  </p>
                  <p className="mt-1 text-2xl font-black text-slate-900">
                    {data?.data.data.user.bookmarksCount || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feed Section */}
      <section className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border bg-white p-3 shadow-sm">
          <div className="grid grid-cols-2 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("my-posts")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition ${
                activeTab === "my-posts"
                  ? "bg-white text-blue-600 shadow"
                  : "text-gray-600"
              }`}
            >
              <FileText size={16} />
              My Posts
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition ${
                activeTab === "saved"
                  ? "bg-white text-blue-600 shadow"
                  : "text-gray-600"
              }`}
            >
              <Bookmark size={16} />
              Saved
            </button>
          </div>
          <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
            {activeTab === "my-posts"
              ? getMyPosts?.length || 0
              : data?.data.data.user.bookmarksCount || 0}
          </span>
        </div>

        {/* Posts List */}
        <div className="space-y-3">
          {activeTab === "my-posts" ? (
            getMyPosts?.length > 0 ? (
              getMyPosts?.map((post) => (
                <article key={post.id}>
                  <PostCard
                    isPostDetails={false}
                    post={post}
                    className="bg-gray-100 rounded-2xl w-full bordershadow-sm hover:shadow-md transition"
                  />
                </article>
              ))
            ) : (
              <article className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition">
                <p className="text-center text-gray-500 py-10">
                  "No posts yet ⭐"
                </p>
              </article>
            )
          ) : (
            <SavedPosts />
          )}
        </div>
      </section>
    </div>
  );
}
