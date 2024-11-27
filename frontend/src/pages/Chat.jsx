import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useChat } from "../hooks/useChat";
import Input from "../components/Input.jsx";
import ChatDisplay from "../components/ChatDisplay.jsx";
import ChatHeader from "../components/ChatHeader.jsx";
import LeftSidebar from "../components/LeftSidebar.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
  setChatId,
  addMessage,
  deleteMessage,
  addUnreadMessage,
} from "../store/chatSlice.js";
import { useSocket } from "../store/SocketContext.jsx";
import { useAuth } from "../store/AuthContext.jsx";

export default function Chat({ clickedMobChat, setClickedMobChat }) {
  const [isClickedAiChat, setIsClickedAiChat] = useState(false);
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [chatQuery, setChatQuery] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [image, setImage] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const { cid, rid } = useParams();
  const typingTimeoutRef = useRef(null);
  const dispatch = useDispatch();
  const { socket } = useSocket();

  const { sendMessage, sendQuery } = useChat();
  const { user } = useAuth();

  const messages = useSelector((state) => state.chat.messages);
  const aiMessages = useSelector((state) => state.chat.aiMessages);
  const chatId = useSelector((state) => state.chat.chatId);

  console.log("message", messages);
  console.log("current chat id:", chatId);

  useEffect(() => {
    if (cid) {
      dispatch(setChatId(cid));
    }
  }, [cid]);

  useEffect(() => {
    if (chatQuery) {
      setQuery(chatQuery);
    } else setQuery("");
  }, [chatQuery]);

  const handleTyping = () => {
    socket.emit("startTyping", chatId);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stoppedTyping", chatId);
    }, 1000);
  };

  const onTyping = (uid) => {
    
    if (uid) {
      setIsTyping(true);
      setTypingUser(uid);
    }
  };

  const stoppedTyping = () => {
    // const updatedTypingUser = typingUser.filter(
    //   (item) => item.userName != user.fullName
    // );
    // setTypingUser(updatedTypingUser);
    setIsTyping(false);
  };

  const handleInputChange = (e) => {
    setText(e.target.value);
    if (!socket || !isConnected) return;

    handleTyping();
  };

  useEffect(() => {
    setMessage({ text, image });
  }, [text, image]);

  const onchangeAddImage = (e) => {
    const file = e.target.files[0];
    //console.log("file", file);

    if (file) {
      setImageUrl(URL.createObjectURL(file));
      setImage(file);
    }
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    sendMessage(message);
    setMessage("");
    setText("");
    setImage(null);
    setImageUrl("");
  };

  const handleAiMessageSubmit = (e) => {
    e.preventDefault();
    sendQuery();
    setQuery("");
  };

  const onConnect = () => {
    setIsConnected(true);
    console.log(user?.fullName, " is connected to socket");
  };

  const onDisconnect = () => {
    setIsConnected(false);
    console.log(user?.fullName, " is disconnected to socket");
  };

  // receive message
  const onMessageReceived = (newMessage) => {
    console.log("Message received from socket:", newMessage);
    if (newMessage?.chat !== chatId) {
      dispatch(addUnreadMessage(newMessage));
    } else {
      dispatch(addMessage(newMessage));
    }
    //console.log(newMessage);
  };

  const onMessageDelete = (message) => {
    dispatch(deleteMessage(message._id));
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("connected", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("messageReceived", onMessageReceived);
    socket.on("messageDelete", onMessageDelete);
    socket.on("messageTyping", onTyping);
    socket.on("stoppedTyping", stoppedTyping);
    return () => {
      socket.off("connected", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("messageReceived", onMessageReceived);
      socket.off("messageDelete", onMessageDelete);
      socket.off("messageTyping", onTyping);
      socket.off("stoppedTyping", stoppedTyping);
    };
  }, [socket]);

  return (
    <div className=" flex h-svh w-svw">
      <div
        className={` ${
          clickedMobChat ? "hidden" : ""
        } lg:block w-full h-full lg:w-auto`}
      >
        <LeftSidebar setClickedMobChat={setClickedMobChat} />
      </div>
      <div
        className={` bg-slate-900 h-full w-full  ${
          clickedMobChat ? "block" : "hidden"
        } lg:block`}
      >
        <ChatHeader
          rid={rid}
          isClickedAiChat={isClickedAiChat}
          setIsClickedAiChat={setIsClickedAiChat}
        />

        <div>
          {!isClickedAiChat ? (
            <div className=" h-svh">
              <ChatDisplay
                messages={messages}
                setIsClickedAiChat={setIsClickedAiChat}
                setChatQuery={setChatQuery}
                isTyping={isTyping}
                typingUser={typingUser}
              />

              <Input
                value={text}
                onChange={handleInputChange}
                placeholder="start Chat"
                disabled={!text && !image}
                onSubmit={handleMessageSubmit}
                onchangeAddImage={onchangeAddImage}
                imageUrl={imageUrl}
                typingTimeoutRef={typingTimeoutRef}
              />
            </div>
          ) : (
            // Ai Chat
            <div className=" h-svh">
              <ChatDisplay messages={aiMessages} />
              <Input
                value={query}
                onChange={handleQueryChange}
                placeholder="start Ai Chat"
                disabled={!query}
                onSubmit={handleAiMessageSubmit}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
