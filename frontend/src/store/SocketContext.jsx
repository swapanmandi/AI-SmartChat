import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

const getSocket = () => {
  const token = localStorage.getItem("token");

  return io(import.meta.env.VITE_SOCKET_URI, {
    withCredentials: true,
    auth: {
      token,
    },
  });
};

const SocketContext = createContext();

const useSocket = () => {
  return useContext(SocketContext);
};

function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = getSocket();
    setSocket(socketInstance);

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  return (
    <>
      <SocketContext.Provider value={{ socket }}>
        {children}
      </SocketContext.Provider>
    </>
  );
}

export { SocketProvider, useSocket };
