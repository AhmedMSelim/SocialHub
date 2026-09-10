import React from "react";
import { Navigate } from "react-router-dom";

export default function AuthProtectedRoute({ children }) {
  // MidleWare

  if (localStorage.getItem("userToken")) {
    return <Navigate to="/" />;
  } else {
    return <>{children}</>;
  }
}
