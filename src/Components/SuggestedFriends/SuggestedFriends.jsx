import React, { useContext, useState } from "react";
import { Users, Search, UserPlus, UserCheck } from "lucide-react";
import axios from "axios";
import { UserAuthContext } from "../../Context/UserAuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function SuggestedFriends() {
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);
  const { userData } = useContext(UserAuthContext);
  const query = useQueryClient();

  function followFriends() {
    return axios.get(
      `https://route-posts.routemisr.com/users/suggestions?limit=30`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { data } = useQuery({
    queryKey: ["followFriends"],
    queryFn: followFriends,
  });

  function follow(userId) {
    return axios.put(
      `https://route-posts.routemisr.com/users/${userId}/follow`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { data: followData, mutate } = useMutation({
    mutationFn: follow,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["followFriends"] });
    },
  });

  const filteredUsers = data?.data.data.suggestions.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="hidden rounded-2xl h-fit md:sticky md:top-[84px] md:block border border-slate-200 bg-gray-100 p-3 shadow-sm space-y-1 md:w-1/4">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#1877f2]" />
          <h3 className="text-base font-extrabold text-slate-900">
            Suggested Friends
          </h3>
        </div>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
          {data?.data?.data?.suggestions?.length}
        </span>
      </div>

      {/* Search Bar */}
      <div className="mb-3">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-[#1877f2] focus:bg-white transition-colors"
          />
        </label>
      </div>

      {/* Users List */}
      <div className="space-y-3 max-h-50 overflow-y-auto">
        {filteredUsers?.slice(0, visibleCount).map((user) => {
          return (
            <div
              key={user._id}
              className="rounded-xl border border-slate-200 p-2.5 transition-all hover:border-slate-300"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <img
                    alt={user.name}
                    src={user.photo}
                    className="h-10 w-10 rounded-full object-cover bg-slate-100"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {user.username}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => mutate(user._id)}
                  className={`inline-flex cursor-pointer items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                    user?.data?.data?.following
                      ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      : "bg-[#e7f3ff] text-[#1877f2] hover:bg-[#d8ebff]"
                  }`}
                >
                  {user?.data?.data?.following ? (
                    <>
                      <UserCheck className="w-3.5 h-3.5" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      Follow
                    </>
                  )}
                </button>
              </div>

              <div className="mt-2 text-[11px] font-semibold text-slate-500">
                <span className="rounded-full bg-slate-100 px-2 py-0.5">
                  {user.followersCount} followers
                </span>
              </div>
            </div>
          );
        })}

        {filteredUsers?.length === 0 && (
          <p className="py-4 text-center text-xs text-slate-400">
            No friends found
          </p>
        )}
      </div>

      {/* View More Button */}
      {visibleCount < filteredUsers?.length && (
        <button
          onClick={() => setVisibleCount((prev) => prev + 5)}
          className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors"
        >
          View more
        </button>
      )}
    </div>
  );
}
