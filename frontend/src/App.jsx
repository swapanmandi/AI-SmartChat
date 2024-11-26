import React, { useState } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import Header from "./components/Header.jsx";
import UserContextProvider from "./store/UserContext.jsx";
import { AuthProvider } from "./store/AuthContext.jsx";
import { SocketProvider } from "./store/SocketContext.jsx";

function App() {
  return (
    <>
      <SocketProvider>
        <UserContextProvider>
          <AuthProvider>
            {/* <Header /> */}
            <Outlet />
          </AuthProvider>
        </UserContextProvider>
      </SocketProvider>
    </>
  );
}

export default App;
