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

  // console.log("messages", messages);
  // console.log("user", user);

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
    <div className="h-full flex flex-col">
      {loading ? (
        <Loader />
      ) : (
        <div className=" h-full flex flex-col overflow-y-hidden">
          {/* Scrollable Messages Container */}
          <div className="flex-1 overflow-y-auto">
            {messages?.length > 0 ? (
              messages.map((item, index) => {
                const showSender =
                  index === 0 ||
                  messages[index - 1]?.sender?._id !== item.sender?._id;

                return (
                  <div key={index} className="bg-orange-400">
                    <div
                      className={`w-full text-black p-2 flex ${
                        (item.sender?._id === user?._id ||
                          item.sender?.user === user?._id) &&
                        "justify-end"
                      }`}
                    >
                      {/* Avatar */}
                      <img
                        src={item.sender?.avatar}
                        className={`${
                          (item.sender?._id === user?._id ||
                            item.sender?.user === user?._id) &&
                          "hidden"
                        } ${showSender ? "block" : "invisible"} 
                    h-8 w-8 rounded-full m-1`}
                        alt="Sender Avatar"
                      />

                      {/* Message Bubble */}
                      <div
                        onClick={() => clickedOnMessage(item._id)}
                        className=" relative max-w-[75%] bg-slate-100 rounded-md p-2 m-1 cursor-pointer flex flex-col h-fit"
                        ref={
                          index === messages.length - 1 ? lastMessageRef : null
                        }
                      >
                        {/* Sender Name */}
                        <h3
                          className={`text-xs ${
                            (item.sender?._id === user?._id ||
                              item.sender?.user === user?._id) &&
                            "hidden"
                          } ${showSender ? "block" : "invisible"}`}
                        >
                          {item.sender?.fullName}
                          {item.sender?.user === null ? " AI ~" : " ~"}
                        </h3>

                        {/* Attachments */}
                        {item.attachments?.length > 0 &&
                          item.attachments.map(
                            (attachment, attachmentIndex) => (
                              <div key={attachmentIndex}>
                                {attachment.url && (
                                  <img
                                    className="w-32 h-32 rounded-md"
                                    src={attachment.url}
                                    alt="Attachment"
                                  />
                                )}
                              </div>
                            )
                          )}

                        {/* Message Content */}
                        <p className="text-sm">{item.content}</p>
                        <span className="text-end text-xs text-gray-500">
                          {timeFormat(item.createdAt)}
                        </span>
                        {selectMessageId === item._id && viewMessageOptions && (
                          <div
                            className={` absolute w-28  space-x-2 bg-yellow-400 flex flex-col rounded-md p-2 items-center space-y-1 m-1 z-20 ${
                              item.sender?._id === user?._id ||
                              item.sender?.user === user?._id
                                ? "-left-32"
                                : " left-14"
                            }`}
                          >
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
                              onClick={() => handleDeleteMessage(item._id)}
                              className=" cursor-pointer"
                            >
                              Delete
                            </span>
                          </div>
                        )}
                      </div>
                      {/* <div className=" z-10"> */}
                    </div>
                  </div>
                  // </div>
                );
              })
            ) : (
              <div className="text-center text-gray-500">No Chats</div>
            )}
          </div>

          {/* Typing Indicator */}
          {isTyping && (
            <div className="h-fit w-fit text-black m-2 flex items-center">
              <span className="bg-slate-400 h-8 w-8 rounded-full p-1 m-1"></span>
              <div className="bg-slate-50 rounded-md p-1 m-1 flex flex-col">
                <span className="w-8 text-center animate-bounce">...</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
