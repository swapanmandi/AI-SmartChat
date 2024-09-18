import React, { useContext, useEffect, useRef, useState } from "react";
import Prompt from "./Prompt.jsx";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useParams } from "react-router-dom";
import AiChat from "./AiChat.jsx";
import { io } from "socket.io-client";
import { useSocket } from "../store/SocketContext.jsx";
import { useUser } from "../store/UserContext.jsx";
import { authContext } from "../store/AuthContextProvider.jsx";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(uuidv4());
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [sendStatus, setSendStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isClickedDetails, setIsClickedDetails] = useState(false);
  const [roomUserList, setRoomUserlist] = useState(null);
  const [chatUser, setChatUser] = useState(null);
  const [isClickedAiChat, setIsClickedAiChat] = useState(false);
  const [chatId, setChatId] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [selectMessageId, setSelectMessageId] = useState("");
  const [viewMessageOptions, setViewMessageOptions] = useState(false);

  const { getUserList } = useUser();
  const { userId } = useContext(authContext);
  const { id, roomId } = useParams();
  console.log("receiverId id", id);
  // if (id && sessionId !== id) {
  //   setSessionId(id);
  // }

  console.log("chatId", chatId);

  const socket = useSocket();

  const createChat = async () => {
    try {
      const result = await axios.post(
        `http://localhost:8000/chat/oneononechat/${id}`,
        {},
        {
          withCredentials: true,
        }
      );
      setChatId(result.data.data._id);
    } catch (error) {
      console.error("Error to retrive chat", error);
    } finally {
      setLoading(false);
    }
  };

  const onConnect = () => {
    setIsConnected(true);
  };

  const onDisconnect = () => {
    setIsConnected(false);
  };


// send message
  const sendMessage = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:8000/room/create-message/${chatId}`,
        { content: message },
        {
          withCredentials: true,
        }
      );

      socket.emit("typing", chatId);
      console.log("message", response.data.data.response);
      setSendStatus(true);
      setMessage("");
    } catch (error) {
      console.error("error to send message", error);
    } finally {
      setLoading(false);
    }
  };


  //Get Chat Messages
  const getChatMessages = async () => {
    if (!chatId) {
      return alert("No chat is selected");
    }

    if (!socket) {
      return alert("Soocket is not avialable");
    }

    socket.emit("joinChat", chatId);

    const response = await axios.get(
      `http://localhost:8000/room/get-messages/${chatId}`,
      {
        withCredentials: true,
      }
    );
    console.log("getting chat messages:", response.data.data);
    setMessages(response.data.data);
  };

// delete message
  const deleteMessage = async (id) => {
    axios.delete(
      `${import.meta.env.VITE_BACKEND_API}/room/delete-message/${chatId}/${id}`,
      { withCredentials: true }
    );
    socket.emit("messageDelete", id)
    console.log("id", id)
    //setMessages(prevMsg => prevMsg.filter(msg => msg._id !== id))
    setViewMessageOptions(false)
  };

// message receive event
  const onMessageReceived = (newMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  //message delete event
  const onMessageDeleted = (messageId) =>{
    setMessages(prevMsg => prevMsg.filter(msg => msg._id !== messageId._id))
    console.log("Deleted message with ID:", messageId._id);
  }
 


  useEffect(() => {
    if (id) {
      createChat();
    }
  }, [id]);

  useEffect(() => {
    getUserList();
  }, []);

  useEffect(() => {
    setMessages(null);
    if (!loading && chatId) {
      getChatMessages();
    }
  }, [chatId]);

  useEffect(() => {
    if (!socket) return;

    socket.on("connected", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("messageReceived", onMessageReceived);
    socket.on("messageDelete", onMessageDeleted)

    return () => {
      socket.off("connected", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("messageReceived", onMessageReceived);
      socket.off("messageDelete", onMessageDeleted)
    };
  });

  //copy to clipboard handle

  // const copyToClipboard = (item,code, index)=>{

  //   navigator.clipboard.writeText(item)
  //   .then(() =>{
  //     setCopiedIndex(index)

  //     setTimeout(()=>{
  //       setCopiedIndex(null)
  //     }, 2000)
  //   })
  //   .catch(err =>{
  //     console.log("error tp copy text", err)
  //   })
  // }

  const clickedDetails = () => {
    setIsClickedDetails(!isClickedDetails);

    const getUser = async () => {
      const result = await axios.get(
        `http://localhost:8000/app/users/user/${id}`,
        { withCredentials: true }
      );
      console.log("chat user", result.data.data);
      setChatUser(result.data.data);
    };

    const getRoomUsers = async () => {
      const result = await axios.get(
        `http://localhost:8000/room/users/${roomId}`,
        {
          withCredentials: true,
        }
      );
      console.log("room users", result.data.data);
      setRoomUserlist(result.data.data);
    };

    if (id) {
      getUser();
    } else {
      getRoomUsers();
    }
  };

  const time = new Date();
  const timeFormat = (e) => {
    const date = new Date(e);
    const minutes = date.getMinutes();
    let hours = date.getHours();
    let unit = "AM";
    if (hours > 12) {
      unit = "PM";
    }

    if (hours > 12) {
      hours -= 12;
    }

    return `${hours}:${minutes}`;
  };

  const clickedAiChat = () => {
    setIsClickedAiChat(true);
  };
  const clickedChat = () => {
    setIsClickedAiChat(false);
  };

  const clickedOnMessage = (id) => {
    setViewMessageOptions(!viewMessageOptions);
    setSelectMessageId(id);
  };



  console.log("messages", messages)

  return (
    <>
      <div className=" bg-slate-900 h-screen w-full pb-10">
        <div className=" h-[10%]">
          <div className=" h-full flex items-center justify-between">
            <div
              onClick={clickedChat}
              className={` ${
                isClickedAiChat ? "bg-emerald-300" : " bg-slate-900"
              } h-full w-1/2  flex items-center justify-around`}
            >
              <div
                onClick={clickedDetails}
                className=" h-10 w-10 rounded-full bg-slate-500 m-2"
              >
                {" "}
              </div>
              <span className="  text-white font-bold"> Chat</span>
            </div>
            <div
              onClick={clickedAiChat}
              className={` h-full w-1/2 ${
                isClickedAiChat ? "bg-slate-900" : "bg-emerald-300"
              }  flex items-center justify-center`}
            >
              <div className=" mr-2 text-white font-bold">Ai Chat Room</div>
            </div>
          </div>
          {isClickedDetails && (
            <div className=" h-80 w-60 bg-slate-700">
              <div>
                Account Info
                {roomUserList?.map((item) => (
                  <div key={item._id}>{item.fullName}</div>
                ))}
                {chatUser && (
                  <div className=" flex flex-col">
                    <span>Name: {chatUser?.fullName}</span>
                    <span>Email: {chatUser.email}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className=" bg-orange-400 h-[75%] overflow-y-scroll pb-10">
          {messages ? (
            messages?.map((item) => (
              <div
                key={item._id}
                className={` w-full flex ${
                  item.sender[0]?._id === userId && "justify-end"
                }`}
              >
                {console.log(item.sender[0]?._id, userId)}
                <div className=" h-fit w-fit text-black m-2 flex justify-between">
                  <span
                    className={` ${
                      item.sender[0]?._id === userId && "hidden"
                    } bg-slate-400 h-8 w-8 rounded-full p-1 m-1`}
                  >
                    {item.sender[0]?.fullName}
                  </span>
                  {selectMessageId === item._id && viewMessageOptions && (
                    <div className=" space-x-2">
                      <span>Share</span>
                      <span onClick={() => deleteMessage(item._id)} className=" cursor-pointer">
                        Delete
                      </span>
                    </div>
                  )}
                  <span
                    onClick={() => clickedOnMessage(item._id)}
                    className=" bg-slate-50 rounded-md p-1 m-1 cursor-pointers"
                  >
                    {item.content}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div>No Chats</div>
          )}
        </div>

        <div className=" h-[15%] flex justify-center items-center rounded-md ">
          <form
            className=" bg-blue-500 h-full rounded-sm p-1 flex justify-center items-center  lg:w-1/2"
            onSubmit={sendMessage}
          >
            <input
              className=" outline-none line-clamp-3  m-2 p-3 w-10/12 overflow-y-auto bg-blue-500 text-black"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your Query"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  sendMessage();
                }
              }}
            ></input>
            <button
              className=" bg-amber-600 h-fit w-fit p-2 rounded-md disabled:bg-gray-300"
              disabled={!message}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
