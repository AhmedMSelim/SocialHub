import { createContext, useEffect, useState } from "react";

export const UserAuthContext = createContext();

export default function UserAuthContextProvider({ children }) {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (localStorage.getItem("user")) {
      setUserData(JSON.parse(localStorage.getItem("user")));
    }
  }, []);
  return (
    <UserAuthContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserAuthContext.Provider>
  );
}
