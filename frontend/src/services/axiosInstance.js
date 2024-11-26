// axiosInstance.js
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";

const createAxiosInstance = () => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API, // Base URL for your API
    withCredentials: true,
  });

  // Add a request interceptor
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token"); // Retrieve token from local storage or state
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  

  return instance;
};

export default createAxiosInstance;
