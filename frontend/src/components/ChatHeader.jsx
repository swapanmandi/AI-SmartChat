import React, { useState, useContext, useRef, useEffect } from "react";
import { AuthContext } from "../store/AuthContext.jsx";
import { useUser } from "../store/UserContext.jsx";
import { useChat } from "../hooks/useChat.js";
import { useSelector } from "react-redux";
import axios from "axios";

export default function ChatHeader({
  isClickedAiChat,
  setIsClickedAiChat,
  rid,
}) {
  const [isRenameRoom, setIsRenameRoom] = useState(false);
  const [viewParticipantModal, setViewParticipantModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [isClickedChatInfo, setIsClickedChatInfo] = useState(false);
  const [isClickedOnAddUser, setIsClickedOnAddUser] = useState(false);
  const [isClickedRoomIcon, setIsClickedRoomIcon] = useState(false);
  const [roomIcon, setRoomIcon] = useState(null);
  const [isClickedChangeRoomIcon, setIsClickedChangeRoomIcon] = useState(false);

  const { user } = useContext(AuthContext);
  const { userList, getUserList } = useUser();

  const roomIconInputRef = useRef(null);

  const {
    typingUser,
    getRoomInfo,
    handleDeleteOnOneChat,
    createAiChat,
    fetchAiChatMessages,
  } = useChat();

  const roomInfo = useSelector((state) => state.chat.roomInfo);
  const chatId = useSelector((state) => state.chat.chatId);
  const oneOnOneChatInfo = useSelector((state) => state.chat.oneOnOneChatInfo);

  console.log("single chat profile", oneOnOneChatInfo);

  const clickedonAddUser = () => {
    setIsClickedOnAddUser(true);
    getUserList();
  };

  const handleRenameRoomChange = (e) => setNewRoomName(e.target.value);

  const handleRemoveUser = (id) => {
    RemoveUser(id);
    setViewParticipantModal(false);
  };

  const handleDeleteRoom = () => {
    deleteRoom();
    setIsClickedChatInfo(false);
  };

  const handleClickedChatInfo = () => {
    setIsClickedChatInfo(!isClickedChatInfo);
    if (!rid) {
      getRoomInfo();
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (e.target.checked) {
      setAddUser(val);
    } else {
      setAddUser("");
    }
  };

  const onRenameRoomSubmit = (e) => {
    e.preventDefault();
    handleRenameRoom(newRoomName);
    setIsRenameRoom(false);
  };

  const handleRenameRoom = async () => {
    //e.preventDefault();
    const result = await axios.patch(
      `${import.meta.env.VITE_BACKEND_API}/chats/rename-room/${chatId}`,
      { name: newRoomName },
      { withCredentials: true }
    );
    //setIsRenameRoom(false);
  };

  const handleAddUser = async (id) => {
    console.log("add id", id);
    await axios.patch(
      `${import.meta.env.VITE_BACKEND_API}/chats/add-participant`,
      { chatId: chatId, participantId: id },
      { withCredentials: true }
    );
  };

  const deleteRoom = async () => {
    await axios.delete(
      `${import.meta.env.VITE_BACKEND_API}/chats/delete-room/${chatId}`,
      { withCredentials: true }
    );
    navigate("/app");
  };

  const RemoveUser = async (userId) => {
    await axios.patch(
      `${import.meta.env.VITE_BACKEND_API}/chats/remove-participant`,
      { chatId: chatId, participantId: userId },
      { withCredentials: true }
    );
  };

  // const modalRef = useRef();
  // const handleClickOutsideModal = (e) => {
  //   if (modalRef.current && !modalRef.current.contains(e.target)) {
  //     setIsClickedChatInfo(false);
  //   }
  // };

  // useEffect(() => {
  //   if (isClickedChatInfo) {
  //     document.addEventListener("mousedown", handleClickOutsideModal);
  //   } else {
  //     document.removeEventListener("mousedown", handleClickOutsideModal);
  //   }

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutsideModal);
  //   };
  // }, [isClickedChatInfo]);

  const getButtonClass = (isActive) =>
    isActive ? "bg-slate-900" : "bg-orange-400";

  const renderTypingIndicator = () => {
    if (!typingUser) return null;
    const suffix = typingUser.length > 1 ? " are" : " is";
    return typingUser.map((item) => (
      <span key={item}>
        {item}
        {suffix} typing...
      </span>
    ));
  };

  const onChangeRoomIcon = async (e) => {
    const file = e.target.files[0];

    if (file) {
      setRoomIcon(URL.createObjectURL(file));
      const formData = new FormData();
      formData.append("roomIcon", file);

      try {
        const response = await axios.patch(
          `${
            import.meta.env.VITE_BACKEND_API
          }/chats/change-room-icon/${chatId}`,
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Upload success:", response.data);
      } catch (error) {
        console.error("Upload failed:", error.response?.data || error.message);
      }
    }
  };

  const handleClickedChageRoomIcon = () => {
    roomIconInputRef.current.click();
  };

  const renderRoomInfo = () => {
    if (roomInfo?.isRoomChat && !rid) {
      return (
        <div className="bg-slate-500 p-2 rounded-sm z-10 absolute">
          {roomInfo?.roomIcon && (
            <div>
              <img
                onClick={() => setIsClickedRoomIcon(!isClickedRoomIcon)}
                className=" h-20 w-20"
                src={roomInfo?.roomIcon}
              ></img>
            </div>
          )}
          {isClickedRoomIcon && (
            <div>
              <ul>
                <li>View Room Icon</li>
                <li>Remove Room Icon</li>

                <input
                  className=" hidden"
                  ref={roomIconInputRef}
                  type="file"
                  onChange={onChangeRoomIcon}
                />

                <li onClick={handleClickedChageRoomIcon}>Change Icon</li>
              </ul>
            </div>
          )}

          <div className="bg-red-300 mb-2 flex space-x-2">
            <h2>{roomInfo.name}</h2>
            <button
              onClick={() => setIsRenameRoom(true)}
              className="p-1 rounded-md bg-slate-400"
            >
              Change
            </button>
          </div>
          <div className="flex flex-col space-y-2">
            <button className="bg-red-300" onClick={clickedonAddUser}>
              Add User
            </button>
            <button className="bg-red-300" onClick={handleDeleteRoom}>
              Delete Room
            </button>
          </div>

          {isRenameRoom && (
            <form
              onSubmit={onRenameRoomSubmit}
              className="bg-cyan-500 flex flex-col p-2 rounded-md"
            >
              New Room Name:
              <input
                onChange={handleRenameRoomChange}
                value={newRoomName}
                className="outline-none text-black"
              />
              <div className="flex">
                <button
                  type="button"
                  className="p-1 bg-slate-400 rounded-md m-1 w-fit"
                  onClick={() => setIsRenameRoom(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="p-1 bg-slate-400 rounded-md m-1 w-fit"
                >
                  Save
                </button>
              </div>
            </form>
          )}

          {isClickedOnAddUser && (
            <div>
              <ul className="bg-slate-700">
                {userList?.map((user) => (
                  <li
                    className="m-1 p-1 flex justify-between px-3"
                    key={user._id}
                  >
                    <span>{user.fullName}</span>
                    <button
                      onClick={() => handleAddUser(user._id)}
                      className="bg-green-400 p-1 rounded"
                    >
                      Add
                    </button>
                  </li>
                ))}
              </ul>
              <button onClick={() => setIsClickedOnAddUser(false)}>
                Close
              </button>
            </div>
          )}

          <ul className="bg-orange-300">
            {roomInfo.participants?.map((participant) => (
              <li key={participant._id}>
                <span>{participant.fullName}</span>
                <button
                  onClick={() => handleRemoveUser(participant._id)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  };

  const renderOneOnOneChatInfo = () => {
    if (oneOnOneChatInfo && rid) {
      return (
        <div className="absolute bg-slate-500 z-20 p-2 rounded-md shadow-lg text-white">
          {oneOnOneChatInfo?.participants?.map((item) => (
            <div key={item._id} className="mb-2 last:mb-0">
              {item._id !== user._id && (
                <div className="flex flex-col space-y-1">
                  <span className="font-semibold">{item.fullName}</span>
                  <span
                    onClick={handleDeleteOnOneChat}
                    className="cursor-pointer text-red-500 hover:text-red-700 transition-colors"
                  >
                    Delete Chat
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }
  };

  // create ai chat

  const handleClickedAiChat = () => {
    setIsClickedAiChat(true);
    fetchAiChatMessages();
    createAiChat();
  };

  const handleClickedChat = () => {
    setIsClickedAiChat(false);
  };

  return (
    <div className="h-12 w-full">
      <div className="h-full flex">
        {/* CHAT */}
        <div
          onClick={handleClickedChat}
          className={`h-full flex justify-around w-1/2 items-center ${
            isClickedAiChat ? " bg-slate-950" : " bg-orange-400"
          } `}
        >
          <div
            onClick={handleClickedChatInfo}
            className=" object-contain h-10 w-10 rounded-full bg-white m-2"
          >
            {roomInfo?._id === chatId && (
              <img
                className=" h-10 w-10"
                src={roomInfo?.roomIcon}
                alt="Avatar"
              ></img>
            )}
            {oneOnOneChatInfo?.participants.find(
              (item) => item._id === rid
            ) && (
              <img
                src={
                  oneOnOneChatInfo.participants.find((item) => item._id === rid)
                    .avatar
                }
                alt="Avatar"
              />
            )}
          </div>
          {renderTypingIndicator()}
          <span>Chat</span>
        </div>

        {/* AI CHAT */}
        <div
          onClick={handleClickedAiChat}
          className={`min-h-full w-1/2 flex justify-center items-center ${
            isClickedAiChat ? "bg-orange-400" : " bg-slate-950"
          } `}
        >
          <span className="text-white font-bold">AI Chat</span>
        </div>
      </div>

      {isClickedChatInfo && renderRoomInfo()}
      {isClickedChatInfo && renderOneOnOneChatInfo()}
    </div>
  );
}
