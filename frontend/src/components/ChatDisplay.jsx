import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../store/AuthContext.jsx";
import Loader from "./Loader.jsx";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat.js";

export default function ChatDisplay({
  messages,
  setIsClickedAiChat,
  setChatQuery,
}) {
  const [selectMessageId, setSelectMessageId] = useState("");
  const [viewMessageOptions, setViewMessageOptions] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const { user, loading } = useContext(AuthContext);

  //console.log("messages", messages)

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

  // console.log("messages",messages)
  // console.log("user id", user._id)

  return (
    <div className=" bg-orange-400 h-[81%] overflow-y-scroll pb-10">
      {loading ? (
        <Loader />
      ) : (
        <>
          {messages?.length > 0 ? (
            messages?.map((item, index) => (
              <div
                key={index}
                className={` w-full flex ${
                  item.sender?._id === user?._id ||
                  (item.sender?.user === user?._id && "justify-end")
                }`}
              >
                {/* {console.log(item.sender?._id, user.cid)} */}
                <div className=" h-fit w-fit text-black m-2 flex justify-between">
                  <span
                    className={` ${
                      item.sender?._id === user?._id ||
                      (item.sender?.user === user?._id && "hidden")
                    } bg-slate-400 h-8 w-8 rounded-full p-1 m-1`}
                  >
                    {item.sender?.fullName}
                  </span>

                  <div
                    onClick={() => clickedOnMessage(item._id)}
                    className=" bg-slate-50 rounded-md p-1 m-1 cursor-pointers flex flex-col"
                  >
                    {item.attachments.length > 0 &&
                      item.attachments?.map((item) => (
                        <div>
                          {item.url && (
                            <img className=" w-32 h-32" src={item.url}></img>
                          )}
                        </div>
                      ))}
                    <p>{item.content}</p>
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
        </>
      )}
    </div>
  );
}
