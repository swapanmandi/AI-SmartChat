import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../store/UserContext.jsx";
import { AuthContext } from "../store/AuthContext.jsx";

export default function LeftSidebar() {
  const [isClickedCreateBtn, setIsClickedCreateBtn] = useState(false);
  const [isClickedCreateRoom, setIsClickedCreateRoom] = useState(false);
  const [selectUser, setSelectUser] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [chats, setChats] = useState(null);
  const [isClickedChatId, setIsClickedChatId] = useState("");

  const { userList, getUserList } = useUser();
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  //delete chat
  const handleChatDelete = async (item) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_API}/deleteChat/${item}`,
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Error", error);
    }
  };

  const clickedCreateBtn = () => {
    setIsClickedCreateBtn(!isClickedCreateBtn);
    getUserList();
  };

  const clickedCreateRoom = () => {
    setIsClickedCreateRoom(!isClickedCreateRoom);
  };

  const handleRoomNameChange = (e) => {
    setRoomName(e.target.value);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectUser([...selectUser, val]);
    } else {
      console.log(val);
      setSelectUser(selectUser.filter((item) => item !== val));
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    const result = await axios.post(
      `${import.meta.env.VITE_BACKEND_API}/chats/create-roomchat`,
      { name: roomName, participants: selectUser },
      {
        withCredentials: true,
      }
    );
    setChats((prevChats) => [...prevChats, result.data.data]);
    setIsClickedCreateRoom(false);
    setIsClickedCreateBtn(false);
  };

  useEffect(() => {
    const chats = async () => {
      const result = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/chats/all-chats/`,
        {
          withCredentials: true,
        }
      );
      console.log("chat list", result.data.data);
      setChats(result.data.data);
    };

    chats();
  }, []);

  const messageRef = useRef();

  const createChat = async (rid) => {
    try {
      if (rid) {
        const result = await axios.post(
          `${import.meta.env.VITE_BACKEND_API}/chats/oneononechat/${rid}`,
          {},
          {
            withCredentials: true,
          }
        );
        navigate(`/app/chat/${result.data.data?._id}/${rid}`);
        setIsClickedCreateBtn(false);
      }
    } catch (error) {
      console.error("Error to retrive chat", error);
    }
  };

  const handleClickedChat = (mId) => {
    setIsClickedChatId(mId);
  };

  console.log(isClickedChatId);
  return (
    <>
      <div className=" bg-slate-700 h-full w-52 lg:w-96 top-8 lg:top-auto absolute lg:relative lg:h-screen lg:flex lg:flex-col">
        <div className=" bg-slate-500 w-full flex justify-between p-2 pr-3">
          <h2 className=" font-semibold">Ai Smart Chat App</h2>
          <button onClick={clickedCreateBtn}><svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-user-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" /><path d="M16 19h6" /><path d="M19 16v6" /><path d="M6 21v-2a4 4 0 0 1 4 -4h4" /></svg></button>
        </div>

        {/* START CREATE ROOM */}
        {isClickedCreateBtn && (
          <div className=" h-96 w-80 bg-slate-300 absolute">
            <div className=" flex flex-col">
              <button
                onClick={clickedCreateRoom}
                className=" bg-orange-400 p-1 m-2"
              >
                Create Chat Room
              </button>
              <button className=" bg-orange-400 p-1 m-2">Add Friend</button>
              <ul>
                {userList?.map((item) => (
                  <li key={item._id} onClick={() => createChat(item._id)}>
                    {item.fullName}
                  </li>
                ))}
              </ul>
            </div>

            {isClickedCreateRoom && (
              <div className=" w-full">
                <form onSubmit={handleCreateRoom}>
                  <h2>Room Name:</h2>
                  <input
                    value={roomName}
                    onChange={handleRoomNameChange}
                    type="text"
                    className=" outline-none p-1 m-2 text-black"
                  ></input>
                  <ul>
                    {userList?.map((item) => (
                      <li className=" w-full m-1 p-1 bg-slate-600 flex justify-between px-3">
                        <span>{item.fullName}</span>

                        <input
                          type="checkbox"
                          onChange={handleInputChange}
                          value={item._id}
                        ></input>
                      </li>
                    ))}
                  </ul>
                  <button type="submit">Create</button>
                </form>
              </div>
            )}
          </div>
        )}
        {/* END CREATE ROOM */}

        {/* CHAT LIST */}
        <div className="overflow-y-auto overflow-x-hidden w-11/12">
          {chats?.map((item, index) => (
            <div key={item._id} className=" w-full m-1 overflow-hidden">
              {item.isRoomChat ? (
                <Link to={`/app/room-chat/${item._id}`}>
                  <h2
                    onClick={() => handleClickedChat(item._id)}
                    className={`  rounded-md w-[99%] p-1 ${
                      isClickedChatId == item._id ? " bg-red-400" : "bg-slate-900"
                    }`}
                  >
                    {item.name}
                  </h2>
                </Link>
              ) : (
                item.participants.map(
                  (participant) =>
                    participant?._id !== user?._id && (
                      <div key={participant._id} className=" w-full">
                        <Link to={`/app/chat/${item._id}/${participant._id}`}>
                          <h2
                            onClick={() => handleClickedChat(item._id)}
                            ref={messageRef}
                            className={` cursor-pointer bg-slate-900 p-1 rounded-md w-[99%] ${
                              isClickedChatId == item._id ? " bg-red-400" : "bg-slate-900"
                            }`}
                          >
                            {participant.fullName}
                          </h2>
                        </Link>
                      </div>
                    )
                )
              )}

              {/* <button
                onClick={() => handleChatDelete(item._id)}
                className=" px-2 mx-3"
              > Delete Chat</button> */}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
