import React, { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../store/AuthContext.jsx";
import Loader from "./Loader.jsx";
import { useChat } from "../hooks/useChat.js";

export default function ChatDisplay({
  isTyping,
  messages,
  typingUser,
  setChatQuery,
  setIsClickedAiChat,
}) {
  const [selectMessageId, setSelectMessageId] = useState("");
  const [viewMessageOptions, setViewMessageOptions] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const { user, loading } = useContext(AuthContext);
  const lastMessageRef = useRef(null);

  console.log("messages", messages);
  console.log("user", user);

  const { handleDeleteMessage } = useChat();

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

  const clickedOnMessage = (cid) => {
    setViewMessageOptions(!viewMessageOptions);
    setSelectMessageId(cid);
  };

  //copy to clipboard handle
  const copyToClipboard = (item) => {
    navigator.clipboard
      .writeText(item)
      .then(() => {
        setIsCopied(true);

        setTimeout(() => {
          setIsCopied(false);
        }, 1000);
      })
      .catch((err) => {
        console.log("Error to copy text!", err);
      });
  };
  const handleMessageDelete = (id) => {
    handleDeleteMessage(id);
    setViewMessageOptions(false);
  };

  const handleChatQuery = (cq) => {
    setChatQuery(`${cq} : `);
    setIsClickedAiChat(true);
  };

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  }, [messages]);

  // console.log("messages",messages)
  //console.log("istyping", isTyping);

  return (
    <div className=" bg-orange-400 h-[81%] overflow-y-scroll overflow-x-hidden pb-10">
      {loading ? (
        <Loader />
      ) : (
        <div>
          {messages?.length > 0 ? (
            messages?.map((item, index) => (
              <div key={index} className=" w-full">
                {/* {console.log(item.sender?._id, user.cid)} */}

                <div
                  className={` w-full text-black p-2 flex ${
                    (item.sender?._id === user?._id ||
                      item.sender?.user === user?._id) &&
                    "justify-end"
                  }`}
                >
                  <img
                    src={item.sender?.avatar}
                    className={` ${
                      (item.sender?._id === user?._id ||
                        item.sender?.user === user?._id) &&
                      "hidden"
                    } h-8 w-8 rounded-full m-1`}
                  ></img>

                  <div
                    onClick={() => clickedOnMessage(item._id)}
                    className=" max-w-[75%] bg-slate-100 rounded-md p-1 m-1 cursor-pointers flex flex-col"
                    ref={index === messages.length - 1 ? lastMessageRef : null}
                  >
                    <h3
                      className={`text-xs ${
                        (item.sender?._id === user?._id ||
                          item.sender?.user === user?._id) &&
                        "hidden"
                      }`}
                    >
                      {item.sender?.fullName}
                      {item.sender?.user === null ? "AI ~" : "~"}
                    </h3>
                    {item.attachments?.length > 0 &&
                      item.attachments?.map((item) => (
                        <div>
                          {item.url && (
                            <img className=" w-32 h-32" src={item.url}></img>
                          )}
                        </div>
                      ))}
                    <p className="">{item.content}</p>
                    <span className=" text-end text-xs">
                      {timeFormat(item.createdAt)}
                    </span>
                  </div>

                  <div className="">
                    {selectMessageId === item._id && viewMessageOptions && (
                      <div className=" space-x-2 bg-yellow-400 flex flex-col rounded-md p-1 space-y-2">
                        <span
                          onClick={() => copyToClipboard(item.content)}
                          className=" cursor-pointer"
                        >
                          {isCopied ? "Copied" : "Copy"}
                        </span>
                        <span className=" cursor-pointer">Share</span>
                        <span
                          onClick={() => handleChatQuery(item.content)}
                          className=" cursor-pointer"
                        >
                          Ask to Ai
                        </span>
                        <span
                          onClick={() => handleMessageDelete(item._id)}
                          className=" cursor-pointer"
                        >
                          Delete
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>No Chats</div>
          )}

          {isTyping && (
            <div className=" h-fit w-fit text-black m-2 flex justify-between">
              <span className="bg-slate-400 h-8 w-8 rounded-full p-1 m-1"></span>
              <div className="bg-slate-50 rounded-md p-1 m-1 cursor-pointers flex flex-col">
                <span className=" w-8 text-center animate-bounce">...</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
