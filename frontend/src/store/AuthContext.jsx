import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader.jsx";

const AuthContext = createContext();

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  //console.log("auth token", token);

  const signup = async (fullName, email, password) => {
    setIsLoading(true);
    try {
      const data = { fullName, email, password };
      await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/users/signup`,
        data,
        {
          withCredentials: true,
        }
      );
      navigate("/login");
    } catch (error) {
      console.error("Error to sign up.", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signin = async (email, password) => {
    setIsLoading(true);
    try {
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
    } catch (error) {
      console.error("Error to sign in", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signout = async () => {
    setIsLoading(true);

    try {
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
    } catch (error) {
      console.error("Error to sign out.", error);
    } finally {
      setIsLoading(false);
    }
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
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signup,
        signin,
        signout,
        token,
        user,
        isLoading,
      }}
    >
      {isLoading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider, useAuth };
