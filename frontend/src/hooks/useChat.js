import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  setAiChatId,
  addMessage,
  setIsLoading,
  setMessages,
  setAiMessages,
  setUnreadMessages,
  setRoomInfo,
} from "../store/chatSlice.js";
import { useSocket } from "../store/SocketContext.jsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useChat = () => {
  const dispatch = useDispatch();
  const { socket } = useSocket();

  const navigate = useNavigate();

  const chatId = useSelector((state) => state.chat.chatId);
  const aiChatId = useSelector((state) => state.chat.aiChatId);
  const unreadMessages = useSelector((state) => state.chat.unreadMessages);
  //console.log("unread msg", unreadMessages);

  // Fetch Messages
  const fetchMessages = async () => {
    try {
      dispatch(setMessages(""));
      dispatch(setIsLoading(true));
      if (!chatId) {
        //return alert("No chat is selected");
        console.error("No chat is selected");
      }
      if (!socket) {
        //return alert("Soocket is not avialable");
        console.error("Soocket is not avialable");
      }

      socket.emit("joinChat", chatId);

      dispatch(
        setUnreadMessages(unreadMessages.filter((n) => n.chat !== chatId))
      );

      const result = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/messages/get-messages/${chatId}`,
        {
          withCredentials: true,
        }
      );
      //console.log(result.data.data);
      dispatch(setMessages(result.data.data));
    } catch (error) {
      console.error("Error to fetch chat messages", error);
    } finally {
    }
  };

  // fetch ai messages

  const fetchAiChatMessages = async () => {
    try {
      if (aiChatId) {
        const result = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_API
          }/ai-messages/get-messages/${aiChatId}`,
          { withCredentials: true }
        );
        console.log("get ai messages", result.data.data);
        dispatch(setAiMessages(result.data.data));
      }
    } catch (error) {
      console.error("error to get ai messages", error);
    }
  };

  // Send Message
  const sendMessage = async (message) => {
    const formData = new FormData();

    formData.append("content", message.text);
    formData.append("image", message.image);
    //console.log("fd", formData)
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/messages/create-message/${chatId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch(addMessage(result.data.data));
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // delete message

  const handleDeleteMessage = async (mid) => {
    if (!chatId || !mid) {
      console.error("chatId is not avilable.");
    }
    axios.delete(
      `${
        import.meta.env.VITE_BACKEND_API
      }/messages/delete-message/${chatId}/${mid}`,
      { withCredentials: true }
    );
    socket.emit("messageDelete", chatId);
  };

  // fetch room info

  const getRoomInfo = async () => {
    try {
      const result = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/chats/room-info/${chatId}`,
        {
          withCredentials: true,
        }
      );
      //console.log("room info", result.data.data);
      dispatch(setRoomInfo(result.data.data));
    } catch (error) {
      console.error("error to fetch room info");
    }
  };

  // delete oneonone chat

  const handleDeleteOnOneChat = async () => {
    await axios.delete(
      `${import.meta.env.VITE_BACKEND_API}/chats/delete-chat/${chatId}`,
      { withCredentials: true }
    );
    navigate("/app");
    //setIsClickedChatInfo(false);
  };

  // rename room

  const handleRenameRoom = async (e) => {
    e.preventDefault();
    const result = await axios.patch(
      `${import.meta.env.VITE_BACKEND_API}/chats/rename-room/${cid}`,
      { name: newRoomName },
      { withCredentials: true }
    );
    setIsRenameRoom(false);
  };

  // remove user from room

  const removeUser = async (userId) => {
    await axios.patch(
      `${import.meta.env.VITE_BACKEND_API}/chats/remove-participant`,
      { cid: cid, participantId: userId },
      { withCredentials: true }
    );
  };

  // create ai chat

  const createAiChat = async () => {
    //setIsClickedAiChat(true);
    const result = await axios.post(
      `${import.meta.env.VITE_BACKEND_API}/ai-chats/create-aichat/${chatId}`,
      {},
      { withCredentials: true }
    );
    dispatch(setAiChatId(result.data.data?._id));
  };

    const handleClickedAiChat = () => {
     
      dispatch(setAiMessages([]));
      createAiChat();
      fetchAiChatMessages();
    };

  // Fetch Messages
  useEffect(() => {
    fetchMessages();
  }, [chatId]);

  return {
    sendMessage,
    handleDeleteMessage,
    getRoomInfo,
    handleDeleteOnOneChat,
    handleRenameRoom,
    removeUser,
    handleClickedAiChat
  };
};
