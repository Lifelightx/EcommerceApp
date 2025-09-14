import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../ContextApi";

const useAuth = () => {
  const { url, token, setUser } = useContext(StoreContext);
  const [isAuth, setIsAuth] = useState(null); // null = loading

  useEffect(() => {
    if (!token) {
      setIsAuth(false);
      return;
    }

    axios.get(`${url}/api/auth/me`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setUser(res.data.user); // store user in context
        setIsAuth(true);
      })
      .catch(() => {
        setUser(null);
        setIsAuth(false);
      });
  }, [token, url, setUser]); // run again if token changes

  return isAuth;
};

export default useAuth;
