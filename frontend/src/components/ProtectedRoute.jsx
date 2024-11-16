import React, { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import {AuthContext} from "../store/AuthContext.jsx"


export default function ProtectedRoute({ children }) {

const {loading, isLoggedIn} = useContext(AuthContext)

//console.log(isLoggedIn)
if(loading){
  return <div>Loading...</div>
}
   if (!isLoggedIn) {
     return <Navigate to="/signin" />;
  }

  return children;
}
