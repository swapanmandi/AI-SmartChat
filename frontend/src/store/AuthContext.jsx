import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader.jsx";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();


  const signup = async (fullName, email, password) => {
    const data = { fullName, email, password };
    await axios.post(`${import.meta.env.VITE_BACKEND_API}/users/signup`, data, {
      withCredentials: true,
    });
    navigate("/login");
  };

  const signin = async (email, password) => {
    const data = { email, password };
    const result = await axios.post(
      `${import.meta.env.VITE_BACKEND_API}/users/signin`,
      data,
      { withCredentials: true }
    );

    navigate("/app");
    setToken(result.data.data.accessToken);
    setUser(result.data.data.user);

    localStorage.setItem("token", result.data.data.accessToken);
    localStorage.setItem("user", JSON.stringify(result.data.data.user));
  };



  const signout = async () => {
    await axios.post(
      `${import.meta.env.VITE_BACKEND_API}/users/signout`,
      {},
      {
        withCredentials: true,
      }
    );
    navigate("/signin");
    setToken(null);
    setUser(null);
    localStorage.clear();
  };

  useEffect(() => {
   
      setIsLoading(true);
      const _token = localStorage.getItem("token");
      const _user = JSON.parse(localStorage.getItem("user"));

      if (_token && _user) {
        setToken(_token);
        setUser(_user);
      } 
      
      setIsLoading(false);

  }, [navigate]);


  return (
    <AuthContext.Provider
      value={{
        signup,
        signin,
        signout,
        token,
        user,
      }}
    >
      {isLoading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthContext, AuthProvider, useAuth };
