import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";



export default function LeftSidebar() {
  const [chatList, setChatList] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false)


// get list
  useEffect(() => {
    const getMessages = async () => {
      const response = await axios.get(
        `http://localhost:8000/chat/chatList`,
        {
          withCredentials: true,
        }
      );
      setChatList(response.data.data.list);
    
    };
    //console.log("list", chatList);
    getMessages();
  }, [isDeleted]);


  //delete chat

  const handleChatDelete = async(item)=>{
   try {
     const response = await axios.delete(`http://localhost:8000/chat/deleteChat/${item}`,
      {
        withCredentials: true
      }
     )
     setIsDeleted(true)
   } catch (error) {
    console.log("Error", error)
   }
  }

  return (
    <>
      <div className=" bg-slate-700 h-full w-60 lg:w-96 top-8 lg:top-auto absolute lg:relative lg:h-screen border border-gray-200 lg:flex lg:justify-center">
        
        <div className=" overflow-y-auto">
        <h2 className=" font-semibold">Previous Chats</h2>
         
          
            
              {chatList?.map((item, index) => (
                <div className=" m-1 overflow-y-auto flex">
               <Link to={`/app/chat/${item.sessionId}`}> <h2 className="  rounded-md hover:bg-slate-500 p-2" key={index}>{item.sessionId}</h2></Link>
               <button onClick={() => handleChatDelete(item._id)} className=" px-2 mx-3">:</button>
               </div>
              ))}
            
          
        </div>
      </div>
    </>
  );
}
