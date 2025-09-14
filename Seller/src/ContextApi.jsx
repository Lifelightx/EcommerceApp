import { useEffect, useState, createContext } from "react";

export const StoreContext = createContext();

export const StoreContextProvider = ({ children }) => {
  const url = "http://localhost:7500";

  // initialize from localStorage
  const [sellerToken, setsellerToken] = useState(() => localStorage.getItem("sellerToken") || "");
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // keep localStorage in sync with state
  useEffect(() => {
    if (sellerToken) {
      localStorage.setItem("sellerToken", sellerToken);
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
    } else {
      localStorage.removeItem("sellerToken");
      localStorage.removeItem("user");
    }
  }, [sellerToken, user]);

  const contextVal = {
    url,
    sellerToken,
    setsellerToken,
    user,
    setUser,
  };

  return (
    <StoreContext.Provider value={contextVal}>
      {children}
    </StoreContext.Provider>
  );
};
