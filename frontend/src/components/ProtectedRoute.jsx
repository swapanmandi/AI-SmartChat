import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../store/AuthContext.jsx";

export default function ProtectedRoute() {
  const { token, user } = useAuth();
  // console.log("token", token);
  // console.log("oading", isLoading); 

  return token && user?._id ? <Outlet /> : <Navigate to="/signin" />;
}
