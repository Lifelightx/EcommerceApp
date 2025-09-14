import { useEffect, useState, createContext } from "react";

export const StoreContext = createContext();

export const StoreContextProvider = ({ children }) => {
  const url = "http://localhost:7500";

  // initialize from localStorage
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // keep localStorage in sync with state
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [token, user]);

  const contextVal = {
    url,
    token,
    setToken,
    user,
    setUser,
  };

  return (
    <StoreContext.Provider value={contextVal}>
      {children}
    </StoreContext.Provider>
  );
};
