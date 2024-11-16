import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function AiChat({ roomId }) {
  const [query, setQuery] = useState(null);
  const [sendStatus, setSendStatus] = useState(false);
  const [chatHistory, setChatHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState("");
  const [newChat, setNewChat] = useState([]);

  const timeFormat = () => {
    const date = new Date();
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

  const createAiRoomChat = async () => {
    if (query) {
      setNewChat((prevNewChat) => [
        ...prevNewChat,
        { chat: query, user: "user" },
      ]);
    }
    try {
      const result = await axios.post(
        `http://localhost:8000/room/create-ai-room-chat/${roomId}`,
        { query },
        { withCredentials: true }
      );

      setNewChat((prevNewChat) => [
        ...prevNewChat,
        { chat: result.data.data.text, user: "model" },
      ]);

      setSendStatus(true);
    } catch (error) {
      console.error("error to send query", error);
    }
  };

  useEffect(() =>{
    setNewChat([])
  }, [roomId])

  useEffect(() => {
    const chats = async () => {
      const result = await axios.get(
        `http://localhost:8000/room/ai-room-chat/${roomId}`,
        { withCredentials: true }
      );
      setChatHistory(result.data.data.chats);
      setUser(result.data.data.user);
    };
    chats();
  }, []);

  const chatInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    createAiRoomChat();
    setQuery("");
  };

  console.log("res", newChat);

  return (
    <>
      {/* <div className=" w-full h-full"> */}
      <div className=" h-[75%] overflow-y-auto">
        {chatHistory || newChat ? (
          <div>
            {chatHistory?.map((item, index) => (
              <div
                key={index}
                className={` w-full flex ${
                  item.sender?.fullName === user && "justify-end items-end"
                }`}
              >
                <div className=" h-fit w-fit text-black m-2 flex justify-between">
                  <span
                    className={` ${
                      item.sender?.fullName === user && "hidden"
                    } bg-slate-400 h-8 w-8 rounded-full p-1 m-1`}
                  >
                    {item.sender === null ? "Ai" : `${item.sender?.fullName}`}
                  </span>

                  <span className=" bg-slate-50 rounded-md p-1 m-1 max-w-xl">
                    {item.message}
                  </span>
                </div>
              </div>
            ))}

            <div className=" h-fit w-full ">
              {newChat?.map((item) => (
                <div
                  className={` m-2 flex text-black ${
                    item.user === "user" ? " justify-end" : " justify-start"
                  }`}
                >
                  <div className=" flex">
                    <div className={` bg-slate-400 h-8 w-8 rounded-full text-center m-2 ${item.user === "user" && 'hidden'}`}>Ai</div>
                    <div className=" bg-white p-1 m-2 rounded-md w-fit max-w-xl">
                      {item.chat}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div> No Chats</div>
        )}
      </div>

      <div className="flex justify-center items-center rounded-md lg:min-h-8 lg:w-full overflow-hidden ">
        <form
          className=" bg-blue-500 rounded-sm p-1 flex justify-around items-center lg:w-2/3"
          onSubmit={handleChatSubmit}
        >
          <textarea
            className=" outline-none line-clamp-3  m-2 p-3 w-10/12 overflow-y-auto bg-blue-500 text-black"
            value={query}
            onChange={chatInputChange}
            placeholder="Your Query"
          ></textarea>
          <button className=" bg-amber-600 h-fit w-fit p-2 rounded-md">
            Send
          </button>
        </form>
      </div>
      {/* </div> */}
    </>
  );
}
