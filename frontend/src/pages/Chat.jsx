import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useChat } from "../hooks/useChat";
import Input from "../components/Input.jsx";
import ChatDisplay from "../components/ChatDisplay.jsx";
import ChatHeader from "../components/ChatHeader.jsx";
import LeftSidebar from "../components/LeftSidebar.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
  setChatId,
  addMessage,
  addAiMessage,
  deleteMessage,
  addUnreadMessage,
} from "../store/chatSlice.js";
import { useSocket } from "../store/SocketContext.jsx";
import { useAuth } from "../store/AuthContext.jsx";
import axios from "axios";

export default function Chat() {
  const [isClickedAiChat, setIsClickedAiChat] = useState(false);
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [chatQuery, setChatQuery] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [image, setImage] = useState(null);

  const [typingUser, setTypingUser] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const { cid, rid } = useParams();
  const typingTimeoutRef = useRef(null);
  const dispatch = useDispatch();
  const { socket } = useSocket();

  const navigate = useNavigate();
  const { sendMessage } = useChat();

  const messages = useSelector((state) => state.chat.messages);
  const aiMessages = useSelector((state) => state.chat.aiMessages);
  const chatId = useSelector((state) => state.chat.chatId);
  const aiChatId = useSelector((state) => state.chat.aiChatId);

  // console.log("ai message", aiMessages);
  //console.log("current chat id on chat page:", chatId);
  // console.log("ai chat id", aiChatId);

  useEffect(() => {
    const handlePopState = () => {
      navigate("/app");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

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

  const handleInputChange = (e) => {
    setText(e.target.value);
    if (!socket) return;
    // if (!socket || !isConnected) return;
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
    if (!socket || !chatId) return;

    sendMessage(message);
    // stop typing event
    setMessage("");
    setText("");
    setImage(null);
    setImageUrl("");
  };

  const handleAiMessageSubmit = async (e) => {
    e.preventDefault();

    if (aiChatId) {
      const result = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_API
        }/ai-messages/send-query/${aiChatId}`,
        { query },
        { withCredentials: true }
      );

      // dispatch(
      //   addAiMessage({
      //     content: result.data.data.query,
      //     sender: { role: "user", user: user._id },
      //   })
      // );
      setQuery("");
    }
  };

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

  const onAiMessageReceived = (newAiMessage) => {
    if (newAiMessage) {
      dispatch(addAiMessage(newAiMessage));
      //console.log("ai msg", newAiMessage);
    }
  };

  const onMessageDelete = (message) => {
    dispatch(deleteMessage(message._id));
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("messageReceived", onMessageReceived);
    socket.on("receivedAiMessage", onAiMessageReceived);
    socket.on("messageDelete", onMessageDelete);
    socket.on("messageTyping", onTyping);
    socket.on("stoppedTyping", stoppedTyping);
    return () => {
      socket.off("messageReceived", onMessageReceived);
      socket.off("receivedAiMessage", onAiMessageReceived);
      socket.off("messageDelete", onMessageDelete);
      socket.off("messageTyping", onTyping);
      socket.off("stoppedTyping", stoppedTyping);
    };
  }, [socket]);

  return (
    <div className=" h-svh w-full lg:flex overflow-hidden">
      <div className=" hidden lg:flex lg:w-96">
        <LeftSidebar />
      </div>

      {/* Chat Container */}
      <div className=" bg-orange-400 flex h-full flex-col w-full">
        <div className=" h-[8%]">
          <ChatHeader
            rid={rid}
            isClickedAiChat={isClickedAiChat}
            setIsClickedAiChat={setIsClickedAiChat}
          />
        </div>

        {!isClickedAiChat ? (
          <div className=" bg-slate-950 h-[92%]">
            <div className=" bg-orange-400 h-[90%]">
              <ChatDisplay
                messages={messages}
                setIsClickedAiChat={setIsClickedAiChat}
                setChatQuery={setChatQuery}
                isTyping={isTyping}
                typingUser={typingUser}
              />
            </div>
            <div className=" h-[10%] flex items-center justify-center">
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
          </div>
        ) : (
          // Ai Chat
          <div className=" bg-slate-950 h-[92%]">
            <div className=" bg-orange-400 h-[90%]">
              <ChatDisplay messages={aiMessages} />
            </div>
            <div className=" h-[10%] flex items-center justify-center">
              <Input
                value={query}
                onChange={handleQueryChange}
                placeholder="start Ai Chat"
                disabled={!query}
                onSubmit={handleAiMessageSubmit}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
