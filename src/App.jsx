import React, { Children } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Notfound from "./Components/Notfound/Notfound";
import Layout from "./Components/Layout/Layout";
import Home from "./Components/Home/Home";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import Profile from "./Components/Profile/Profile";
import AuthContextProvider from "./Context/AuthContext.jsx";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute.jsx";
import AuthProtectedRoute from "./Components/AuthProtectedRoute/AuthProtectedRoute.jsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import PostDetails from "./Components/PostDetails/PostDetails.jsx";
import Settings from "./Components/Settings/Settings.jsx";
import UserAuthContextProvider from "./Context/UserAuthContext.jsx";
import Notifications from "./Components/Notifications/Notifications.jsx";
import MyPostsContextProvider from "./Context/MyPostsContext.jsx";
import { ToastContainer } from "react-toastify";
import { useNetworkState } from "react-use";
import DetectOffline from "./Components/DetectOffline/DetectOffline.jsx";
import { HelmetProvider } from "react-helmet-async";
import Footer from "./Components/Footer/Footer.jsx";
import FooterLayout from "./Components/FooterLayout/FooterLayout.jsx";

const qury = new QueryClient();

const router = createBrowserRouter([
  {
    path: "",
    element: <FooterLayout />,
    children: [
      {
        path: "login",
        element: (
          <AuthProtectedRoute>
            <Login />
          </AuthProtectedRoute>
        ),
      },
      {
        path: "register",
        element: (
          <AuthProtectedRoute>
            <Register />
          </AuthProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "home",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: "postdetails/:id",
        element: (
          <ProtectedRoute>
            <PostDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "notifications",
        element: (
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        ),
      },
    ],
  },
  { path: "*", element: <Notfound /> },
]);

export default function App() {
  const { online } = useNetworkState();

  return (
    <>
      {!online && <DetectOffline />}
      <React.StrictMode>
        <HelmetProvider>
          <MyPostsContextProvider>
            <UserAuthContextProvider>
              <QueryClientProvider client={qury}>
                <AuthContextProvider>
                  <RouterProvider router={router}></RouterProvider>
                  <ToastContainer />
                </AuthContextProvider>
              </QueryClientProvider>
            </UserAuthContextProvider>
          </MyPostsContextProvider>
        </HelmetProvider>
      </React.StrictMode>
    </>
  );
}
