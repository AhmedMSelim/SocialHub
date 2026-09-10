import React, { useState } from "react";
import { CheckCheck } from "lucide-react"; // npm install lucide-react
import { Helmet } from "react-helmet-async";

export default function Notifications() {
  const [filter, setFilter] = useState("all"); // 'all' | 'unread'
  const unreadCount = 0;

  return (
    <div className="container w-[98%] min-h-screen mx-auto p-4">
      <Helmet>
        <title>Notifications</title>
      </Helmet>
      <div className="mx-auto max-w-7xl px-3 py-3.5">
        <main className="min-w-0">
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm sm:rounded-2xl">
            {/* Header Section */}
            <div className="border-b border-slate-200 p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
                    Notifications
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Realtime updates for likes, comments, shares, and follows.
                  </p>
                </div>
                <button
                  disabled
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-60 sm:w-auto"
                >
                  <CheckCheck className="w-[15px] h-[15px]" />
                  Mark all as read
                </button>
              </div>

              {/* Filter Tabs */}
              <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:items-center">
                <button
                  onClick={() => setFilter("all")}
                  className={`rounded-full px-4 py-1.5 text-sm font-bold transition-colors ${
                    filter === "all"
                      ? "bg-[#1877f2] text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("unread")}
                  className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold transition-colors ${
                    filter === "unread"
                      ? "bg-[#1877f2] text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Unread
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      filter === "unread"
                        ? "bg-white text-[#1877f2]"
                        : "bg-white text-[#1877f2]"
                    }`}
                  >
                    {unreadCount}
                  </span>
                </button>
              </div>
            </div>

            {/* Notifications List Content */}
            <div className="space-y-2 p-3 sm:p-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
                <p className="text-sm font-semibold text-slate-500">
                  No notifications yet.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
