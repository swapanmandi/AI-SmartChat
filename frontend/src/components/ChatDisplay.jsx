import React, { useState, useContext, useEffect } from "react";
import { useUser } from "../store/UserContext";
import { AuthContext } from "../store/AuthContext.jsx";
import Loader from "./Loader.jsx";

export default function ChatDisplay({
  oneOnOneChatInfo,
  handleDeleteOnOneChat,
  setIsClickedAiChat,
  loading,
  messages,
  cid,
  handleChatQuery,
  deleteMessage,
}) {
  const [selectMessageId, setSelectMessageId] = useState("");
  const [viewMessageOptions, setViewMessageOptions] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const { user } = useContext(AuthContext);
  const { userList, getUserList } = useUser();

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
  const handleDeleteMessage = (id) => {
    deleteMessage(id);
    setViewMessageOptions(false);
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
            messages?.map((item) => (
              <div
                key={item._id}
                className={` w-full flex ${
                  item.sender?._id === user?._id || item.sender?.user === user?._id && "justify-end"
                }`}
              >
                {/* {console.log(item.sender?._id, user.cid)} */}
                <div className=" h-fit w-fit text-black m-2 flex justify-between">
                  <span
                    className={` ${
                      item.sender?._id === user?._id || item.sender?.user === user?._id && "hidden"
                    } bg-slate-400 h-8 w-8 rounded-full p-1 m-1`}
                  >
                    {item.sender?.fullName}
                  </span>

                  <div
                    onClick={() => clickedOnMessage(item._id)}
                    className=" bg-slate-50 rounded-md p-1 m-1 cursor-pointers flex flex-col"
                  >
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
                          onClick={() => handleDeleteMessage(item._id)}
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
