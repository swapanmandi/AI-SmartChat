import React, { useState, useEffect } from "react";
import LeftSidebar from "../components/LeftSidebar";
import {
  setChatId,
  addMessage,
  addAiMessage,
  addUnreadMessage,
} from "../store/chatSlice.js";
import { useSocket } from "../store/SocketContext.jsx";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useAuth } from "../store/AuthContext.jsx";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);

  const { socket } = useSocket();
  const dispatch = useDispatch();
  const chatId = useSelector((state) => state.chat.chatId);
  const { token, user } = useAuth();

  useEffect(() => {
    dispatch(setChatId(""));
  }, []);

  const onConnect = () => {
    setIsConnected(true);
    //console.log(user?.fullName, " is connected to socket");
    //alert("");
  };

  const onDisconnect = () => {
    setIsConnected(false);
    //console.log(user?.fullName, " is disconnected to socket");
  };

  // receive message
  const onMessageReceived = (newMessage) => {
    console.log("Message received from socket:", newMessage);
    if (newMessage?.chat !== chatId) {
      console.log("its a unopened chat and saved to unread messages");
      dispatch(addUnreadMessage(newMessage));
    } else {
      dispatch(addMessage(newMessage));
      console.log("its a opened chat and read on your chat");
    }
    //console.log(newMessage);
  };

  // ai messages receive

  const onAiMessageReceived = (newAiMessage) => {
    if (newAiMessage) {
      dispatch(addAiMessage(newAiMessage));
      console.log("ai msg", newAiMessage);
    }
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("connected", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("messageReceived", onMessageReceived);
    socket.on("receivedAiMessage", onAiMessageReceived);

    return () => {
      socket.off("connected", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("messageReceived", onMessageReceived);
      socket.off("receivedAiMessage", onAiMessageReceived);
    };
  }, [socket]);

  return (
    <div className=" relative flex h-full w-full flex-col lg:flex-row ">
      {token && user?._id && (
        <div className=" w-full lg:w-96">
          <LeftSidebar />
        </div>
      )}

      <div className="flex w-full flex-col items-center justify-center min-h-screen bg-gray-100 overflow-hidden">
        <main className="flex flex-col items-center justify-center flex-grow w-full px-4 py-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Welcome to My AI Chat App
          </h2>
          <p className=" text-gray-800 ">Select a Chat and satrt Messaging</p>
        </main>

        <footer className="w-full py-4 bg-white shadow-md">
          <div className="container mx-auto px-4 text-center text-gray-600">
            &copy; {new Date().getFullYear()} My AI Chat App. All rights
            reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}
