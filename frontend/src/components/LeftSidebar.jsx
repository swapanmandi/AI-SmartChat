import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useUser } from "../store/UserContext.jsx";

export default function LeftSidebar() {
  const [isClickedCreateBtn, setIsClickedCreateBtn] = useState(false);
  const [isClickedCreateRoom, setisClickedCreateRoom] = useState(false);
  const [selectUser, setSelectUser] = useState([]);
  const [roomName, setRoomName] = useState("")

  const { setIsDeleted, userList,  rooms } = useUser();

  //delete chat

  const handleChatDelete = async (item) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/chat/deleteChat/${item}`,
        {
          withCredentials: true,
        }
      );
      setIsDeleted(true);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const clickedCreateBtn = () => {
    setIsClickedCreateBtn(!isClickedCreateBtn);
  };

  const clickedCreateRoom = () => {
    setisClickedCreateRoom(!isClickedCreateRoom);
  };


  const handleRoomNameChange = (e) =>{
setRoomName(e.target.value)
  }

  const handleInputChange = (e) => {
    const val = e.target.value;
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectUser([...selectUser, val]);
    }else{
      console.log(val)
      setSelectUser(selectUser.filter(item => item !== val))
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    await axios.post(
      "http://localhost:8000/room/create-room",
     {roomName, users: selectUser},
      {
        withCredentials: true,
      }
    );
  };

  return (
    <>
      <div className=" bg-slate-700 h-full w-60 lg:w-96 top-8 lg:top-auto absolute lg:relative lg:h-screen border border-gray-200 lg:flex lg:flex-col ">
        <div className=" bg-slate-300 w-full flex justify-between p-2">
          <h2 className=" font-semibold">Chats</h2>
          <button onClick={clickedCreateBtn}>Create</button>
        </div>

        {isClickedCreateBtn && (
          <div className=" h-96 w-80 bg-slate-300 absolute">
            <div className=" flex flex-col">
              <button
                onClick={clickedCreateRoom}
                className=" bg-orange-400 p-1 m-2"
              >
                Create AI Chat Room
              </button>
              <button className=" bg-orange-400 p-1 m-2">Add Friend</button>
            </div>

            {isClickedCreateRoom && (
              <div>
                <form onSubmit={handleCreateRoom}>
                  <h2>Room Name:</h2>
                  <input value={roomName} onChange={handleRoomNameChange} type="text" className=" outline-none p-1 m-2 text-black"></input>
                  <ul>
                    {userList?.map((item) => (
                      <li className=" m-1 p-1 bg-slate-600 flex justify-between px-3">
                        <span>{item.fullName}</span>

                        <input
                          type="checkbox"
                          onChange={handleInputChange}
                          value={item._id}
                        ></input>
                      </li>
                    ))}
                  </ul>
                  <button type="submit">Add</button>
                </form>
              </div>
            )}
          </div>
        )}
        <div className=" overflow-y-auto">
          {userList?.map((item, index) => (
            <div key={item._id} className=" m-1 overflow-y-auto flex">
              <Link to={`/app/chat/${item._id}`}>
                {" "}
                <h2 className="  rounded-md hover:bg-slate-500 p-2" key={index}>
                  {item.fullName}
                </h2>
              </Link>
              <button
                onClick={() => handleChatDelete(item._id)}
                className=" px-2 mx-3"
              >
                
              </button>
            </div>
          ))}

{rooms?.map((item, index) => (
            <div key={item._id} className=" m-1 overflow-y-auto flex">
              <Link to={`/app/room-chat/${item._id}`}>
                
                <h2 className="  rounded-md hover:bg-slate-500 p-2" key={index}>
                  {item.name}
                </h2>
              </Link>
              <button
                onClick={() => handleChatDelete(item._id)}
                className=" px-2 mx-3"
              >
                
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
