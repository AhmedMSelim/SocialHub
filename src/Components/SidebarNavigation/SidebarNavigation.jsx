import React, { useState } from "react";
import { Newspaper, Sparkles, Globe, Bookmark } from "lucide-react"; // npm install lucide-react

export default function SidebarNavigation({ activeTab, setActiveTab }) {
  const navItems = [
    { id: "feed", label: "Feed", icon: Newspaper },
    { id: "my-posts", label: "My Posts", icon: Sparkles },
    { id: "community", label: "Community", icon: Globe },
    { id: "saved", label: "Saved", icon: Bookmark },
  ];

  return (
    <div className="rounded-2xl flex flex-wrap h-fit md:sticky md:top-[84px] md:block border border-slate-200 bg-gray-100 p-3 shadow-sm space-y-1 md:w-1/4 w-full">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex w-1/2 md:w-full items-center cursor-pointer gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold transition-colors ${
              isActive
                ? "bg-[#e7f3ff] text-[#1054ac]"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Icon className="w-[17px] h-[17px]" />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
