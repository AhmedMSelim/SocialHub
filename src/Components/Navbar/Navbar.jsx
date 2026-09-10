import React, { useContext, useState } from "react";
import { House, User, MessageCircle, Menu } from "lucide-react";
import logo from "../../assets/socialhub.webp";
import { Link, NavLink, useNavigate } from "react-router-dom";
import ProfileDropdown from "../ProfileDropdown/ProfileDropdown";
import { AuthContext } from "../../Context/AuthContext";
import DefImage from "../../assets/download.jpeg";
import { UserAuthContext } from "../../Context/UserAuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { userToken, setUserToken } = useContext(AuthContext);
  const { userData, setUserData } = useContext(UserAuthContext);

  return (
    <header className="border-b border-slate-100 bg-white sticky top-0 left-0 right-0 z-50 w-full shadow-sm">
      <div className="mx-auto w-[95%] flex max-w-7xl items-center justify-between gap-2 px-2 py-1.5 sm:gap-3 sm:px-3">
        {/* Brand Logo & Name */}
        <Link to="/">
          <div className="flex items-center gap-3">
            <img
              alt="SocialHub"
              className="h-9 w-9 rounded-xl object-cover"
              src={logo}
            />
            <p className="hidden text-xl font-extrabold text-slate-900 sm:block">
              SocialHub
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex min-w-0 items-center gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50/90 px-1 py-1 sm:px-1.5">
          {/* Active Link: Feed */}
          <NavLink
            to="/"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-600 shadow-xs hover:bg-white"
            aria-current="page"
          >
            <House className="h-5 w-5" />
            <span className="hidden sm:inline">Feed</span>
          </NavLink>

          {/* Profile Link */}
          <NavLink
            to="/profile"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-600 hover:bg-white"
          >
            <User className="h-5 w-5" />
            <span className="hidden sm:inline">Profile</span>
          </NavLink>

          {/* Notifications Link */}
          <NavLink
            to="/notifications"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-600 hover:bg-white"
          >
            <div className="relative">
              <MessageCircle className="h-5 w-5" />
            </div>
            <span className="hidden sm:inline">Notifications</span>
          </NavLink>
        </nav>

        {/* User Profile Menu Button */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            type="button"
            className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1.5 hover:bg-slate-100 transition-colors"
          >
            <img
              className="h-8 w-8 rounded-full object-cover"
              src={userData.photo || DefImage}
              alt="User avatar"
            />
            <span className="hidden text-sm font-semibold md:block">
              {userData.name}
            </span>
            <Menu className="h-4 w-4 text-slate-600" />
          </button>
          <ProfileDropdown open={open} setOpen={setOpen} />
        </div>
      </div>
    </header>
  );
}
