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

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);

  const { socket } = useSocket();
  const dispatch = useDispatch();
  const chatId = useSelector((state) => state.chat.chatId);

  useEffect(() => {
    dispatch(setChatId(""));
  }, []);

  const onConnect = () => {
    setIsConnected(true);
    //console.log(user?.fullName, " is connected to socket");
    alert("");
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
    <div className=" flex h-full w-full flex-col lg:flex-row ">
      <div className=" w-full lg:w-96">
        <LeftSidebar />
      </div>

      <div className=" bg-red-500 h-full w-full flex items-center justify-center">
        <div className=" text-center">
          <h2>Select a Chat and Start Messeging with</h2>
          <h1>SMART AI CHAT APP</h1>
        </div>
      </div>
    </div>
  );
}
