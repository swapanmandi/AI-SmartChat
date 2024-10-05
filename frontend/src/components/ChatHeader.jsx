import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../store/AuthContext.jsx";
import { useUser } from "../store/UserContext.jsx";

export default function ChatHeader({
  clickedChat,
  clickedAiChat,
  isClickedAiChat,
  isClickedChatInfo,
  clickedChatInfo,
  roomInfo,
  editingRoomName,
  ClickedonAddUser,
  isClickedOnAddUser,
  handleInputChange,
  setIsClickedOnAddUser,
  handleAddUser,
  oneOnOneChatInfo,
  handleDeleteOnOneChat,
  rid,
  RemoveUser,
  handleDeleteRoom,
  handleRenameRoom,
}) {
  const [isRenameRoom, setIsRenameRoom] = useState(false);
  const [viewParticipantModal, setViewParticipantModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [isClickedChat, setIsClickedChat] = useState(false);
  const { user } = useContext(AuthContext);
  const { userList, getUserList } = useUser();

  const clickedOnParticipant = (cid) => {
    setParticipantId(cid);
    setViewParticipantModal(true);
  };

  const handleRenameRoomChange = (e) => setNewRoomName(e.target.value);

  const onRenameRoomSubmit = (e) => {
    e.preventDefault();
    handleRenameRoom(newRoomName);
    setIsRenameRoom(false);
  };

  const handleRemoveUser = (id) => {
    RemoveUser(id);
    setViewParticipantModal(false);
  };
  return (
    <div className=" h-12 w-full">
      <div className=" h-full flex">
        <div
          onClick={clickedChat}
          className={` ${
            isClickedAiChat ? " bg-slate-900" : " bg-orange-400"
          } h-full flex justify-around w-1/2 items-center`}
        >
          <div
            onClick={clickedChatInfo}
            className=" h-10 w-10 rounded-full bg-slate-500 m-2"
          ></div>
          <span className=" text-white font-bold"> Chat</span>
        </div>
        <div
          onClick={clickedAiChat}
          className={` ${
            isClickedAiChat ? " bg-orange-400" : " bg-slate-900"
          } min-h-full w-1/2 flex justify-center items-center`}
        >
          <span className=" text-white font-bold">Ai Chat</span>
        </div>
      </div>
      {isClickedChatInfo && (
        <div className=" h-80 w-60 bg-slate-700 absolute">
          {/* room chat info */}

          {roomInfo?.isRoomChat && !rid ? (
            <div className=" p-2 rounded-sm z-10 absolute ">
              <div className=" flex space-x-2">
                <h2>{roomInfo.name}</h2>
                <button
                  onClick={editingRoomName}
                  className=" p-1 rounded-md bg-slate-400"
                >
                  Change
                </button>
              </div>
              <div className=" flex flex-col space-y-2">
                <button onClick={ClickedonAddUser}>Add User</button>
                <button onClick={handleDeleteRoom}>Delete Room</button>
              </div>
              {isClickedOnAddUser && (
                <div>
                  <ul>
                    {userList?.map((item) => (
                      <li
                        className=" m-1 p-1 bg-slate-600 flex justify-between px-3"
                        key={item._id}
                      >
                        <span>{item.fullName}</span>

                        <input
                          type="checkbox"
                          onChange={handleInputChange}
                          value={item._id}
                        ></input>
                      </li>
                    ))}
                  </ul>

                  <div className=" flex space-x-2">
                    <button onClick={() => setIsClickedOnAddUser(false)}>
                      Cancel
                    </button>
                    <button onClick={handleAddUser}>Add</button>
                  </div>
                </div>
              )}
              <div></div>
              {isRenameRoom && (
                <div>
                  <form
                    onSubmit={onRenameRoomSubmit}
                    className=" bg-cyan-500 flex flex-col p-2 rounded-md"
                  >
                    New Room Name:
                    <input
                      onChange={handleRenameRoomChange}
                      value={newRoomName}
                      className=" outline-none text-black"
                    ></input>
                    <div className=" flex">
                      <button
                        type="button"
                        className=" p-1 bg-slate-400 rounded-md m-1 w-fit"
                        onClick={() => setIsRenameRoom(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className=" p-1 bg-slate-400 rounded-md m-1 w-fit"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              )}
              <ul>
                {roomInfo.participants?.map((item) => (
                  <div key={item._id}>
                    <li
                      key={item._id}
                      onClick={() => clickedOnParticipant(item._id)}
                    >
                      {item.fullName}
                    </li>

                    {viewParticipantModal && item._id === participantId && (
                      <div className=" bg-indigo-600 p-1 rounded-md flex flex-col space-y-1">
                        <span>Go to Chat</span>
                        <span onClick={() => handleRemoveUser(item._id)}>
                          Remove from Room
                        </span>
                        <span>Make Admin</span>
                        <button onClick={() => setViewParticipantModal(false)}>
                          Close
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </ul>
            </div>
          ) : (
            <div>
              {/* one on one  chat info */}
              <div>
                {oneOnOneChatInfo?.participants?.map((item) => (
                  <div key={item._id}>
                    {item._id !== user._id && (
                      <div className=" flex flex-col space-x-1">
                        <span>{item.fullName} </span>
                        <span
                          onClick={handleDeleteOnOneChat}
                          className=" cursor-pointer"
                        >
                          Delete Chat
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
