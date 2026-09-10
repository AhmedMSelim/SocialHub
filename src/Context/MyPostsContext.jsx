import { createContext, useEffect, useState } from "react";

export const MyPostsContext = createContext();

export default function MyPostsContextProvider({ children }) {
  const [getMyPosts, setGetMyPosts] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("myPosts")) {
      setUserData(JSON.parse(localStorage.getItem("myPosts")));
    }
  }, []);
  return (
    <MyPostsContext.Provider value={{ getMyPosts, setGetMyPosts }}>
      {children}
    </MyPostsContext.Provider>
  );
}
