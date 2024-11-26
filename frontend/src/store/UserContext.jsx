import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

export default function UserContextProvider({ children }) {
  const [userList, setUserList] = useState(null);
  
  
    const getUserList = async () => {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/chats/chat-users`, {
        withCredentials: true,
      });
      //console.log(response.data.data)
      setUserList(response.data.data);
    };
   
  

  return (
    <>
      <UserContext.Provider value={{ getUserList, userList}}>
        {children}
      </UserContext.Provider>
    </>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    console.error("error to get user list from context api");
  }

  return context;
};
