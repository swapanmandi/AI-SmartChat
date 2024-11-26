import { useEffect } from "react";
import io, { Socket } from "socket.io-client";

const socket = io("http://localhost:8000");

const token = localStorage.getItem("token")

const useSocket = (receiverId, onNewMessage) => {
  useEffect(() => {
    socket.emit("joinChat", receiverId);
    socket.on("newMessage", (message) => {
      onNewMessage(message);
    });
    return () => {
      socket.off("newMessage");
      socket.emit("leaveChat", receiverId);
    };
  }, [receiverId, onNewMessage]);
};

export { useSocket };
