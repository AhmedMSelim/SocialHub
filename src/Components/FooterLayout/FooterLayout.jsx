import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer";

export default function Layout() {
  return (
    <>
      <div className="w-full mx-auto min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
