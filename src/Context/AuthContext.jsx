import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [userToken, setUserToken] = useState(null);
  const [userIdLogin, setUserIdLogin] = useState(null);

  // lazy initialization
  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      setUserToken(localStorage.getItem("userToken"));
    }
  }, []);
  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      const { user } = jwtDecode(localStorage.getItem("userToken"));
      setUserIdLogin(user);
    }
  }, [userToken]);
  return (
    <AuthContext.Provider value={{ userToken, setUserToken, userIdLogin }}>
      {children}
    </AuthContext.Provider>
  );
}
