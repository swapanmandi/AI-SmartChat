import React, { useEffect, useRef, useState } from "react";
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


export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(uuidv4());
  const [chatHistory, setChatHistory] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [sendStatus, setSendStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isClickedDetails, setIsClickedDetails] = useState(false);
  const [roomUserList, setRoomUserlist] = useState(null);
  const [chatUser, setChatUser] = useState(null);
  const [user, setUser] = useState("");
  const [isClickedAiChat, setIsClickedAiChat] = useState(false);
  const [chatId, setChatId] = useState("")





  const { id, roomId } = useParams();
  console.log("receiverId id", id, "-", roomId);
  // if (id && sessionId !== id) {
  //   setSessionId(id);
  // }


  const createChat = async() =>{
    const result = await axios.post(`http://localhost:8000/chat/oneononechat/${id}`, {},{
      withCredentials: true
    })

    setChatId(result.data.data._id)
    
  }

  const handleSendMessageBtn = async (e) => {
    try {
      e.preventDefault();
      // if (id) {
      //   setSessionId(id);
      // }
      setMessages([...messages, message]);

      if (roomId) {
        const result = await axios.post(
          "http://localhost:8000/room/create-message",
          { chatId: roomId, content: message },
          {
            withCredentials: true,
          }
        );
      } else {
        const response = await axios.post(
          `http://localhost:8000/room/create-message/${chatId}`,
          {content: message},
          {
            withCredentials: true,
          }
        );
        console.log("message", response.data.data.response);
      }

      setSendStatus(true);

      // setMessages([
      //   ...messages,
      //   { sender: "user", chat: message },
      //   { sender: "model", chat: response.data.data.response },
      // ]);

      setMessage("");
    } catch (error) {
      console.error("error to send message", error);
    } finally {
      setLoading(false);
    }
  };

  //get old chat

  const getChatHistory = async () => {
    const response = await axios.get(
      `http://localhost:8000/chat/chatHistory/${id}`,
      {
        withCredentials: true,
      }
    );

    //console.log("old chat:", response.data.data.chats);

    setChatHistory(response.data.data.chats);
    setUser(response.data.data.user);
  };

  const getRoomHistory = async () => {
    const result = await axios.get(
      `http://localhost:8000/room/get-message/${roomId}`,
      { withCredentials: true }
    );
    //console.log("room chat", result.data.data.messages);
    setChatHistory(result.data.data.messages);
    setUser(result.data.data.user);
  };

  useEffect(() => {
    if (id) {
      createChat()
      getChatHistory();
    }
    if (roomId) {
      getRoomHistory();
    }
    setChatHistory(null);
  }, [id, roomId]);

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

  console.log("chat length", chatHistory);

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

  return (
    <>
      <div className=" bg-slate-900 h-svh lg:w-full overflow-y-auto-auto flex flex-col">
        <div className=" h-16 flex items-center justify-between">
          <div
            onClick={clickedChat}
            className={` ${
              isClickedAiChat ? "bg-emerald-300" : " bg-slate-900"
            } h-full w-1/2  flex items-center justify-around`}
          >
            <div
              onClick={clickedDetails}
              className=" h-10 w-10 rounded-full bg-slate-500 m-2"
            > </div>
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

        {isClickedAiChat ? (
          <AiChat roomId={roomId} />
        ) : (
          <div className=" h-full w-full">
            <div className=" h-[75%] overflow-y-auto">
              {chatHistory ? (
                chatHistory?.map((item) => (
                  <div
                    className={` w-full flex ${
                      item.senderId?.fullName === user && "justify-end"
                    }`}
                  >
                    <div className=" h-fit w-fit text-black m-2 flex justify-between">
                      <span
                        className={` ${
                          item.senderId?.fullName === user && "hidden"
                        } bg-slate-400 h-8 w-8 rounded-full p-1 m-1`}
                      >
                        {" "}
                        {item.senderId?.fullName}{" "}
                      </span>

                      <span className=" bg-slate-50 rounded-md p-1 m-1">
                        {item.message}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div>No Chats</div>
              )}

              <div className=" w-full flex justify-end">
                {messages?.map((item) => (
                  <div className=" bg-slate-50 h-fit w-fit text-black m-2 flex flex-col p-1 rounded-md">
                    <span className="">{item}</span>
                    <span className=" p-1 m-1">
                      {timeFormat(time)} {loading && "🔄"} {sendStatus && "✔"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center items-center rounded-md lg:min-h-8 lg:w-full overflow-hidden pb-8 ">
              <form
                className=" bg-blue-500 rounded-sm p-1 flex justify-around items-center lg:w-1/2"
                onSubmit={handleSendMessageBtn}
              >
                <textarea
                  className=" outline-none line-clamp-3  m-2 p-3 w-10/12 overflow-y-auto bg-blue-500 text-black"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your Query"
                ></textarea>
                <button className=" bg-amber-600 h-fit w-fit p-2 rounded-md">
                  Send
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
