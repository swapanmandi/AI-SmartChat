import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../store/SocketContext.jsx";
import { useUser } from "../store/UserContext.jsx";
import { AuthContext } from "../store/AuthContext.jsx";
import Input from "../components/Input.jsx";
import ChatDisplay from "../components/ChatDisplay.jsx";
import ChatHeader from "../components/ChatHeader.jsx";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isClickedChatInfo,setIsClickedChatInfo] = useState(false);
  const [roomInfo, setRoomInfo] = useState(null);
  const [isClickedAiChat, setIsClickedAiChat] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
 
  const [participantId, setParticipantId] = useState("");
  const [isClickedOnAddUser, setIsClickedOnAddUser] = useState(false);
  const [addUser, setAddUser] = useState("");
  const [oneOnOneChatInfo, setOneOnOneChatInfo] = useState(null);
  const [aiChatId, setAiChatId] = useState("");
  const [aiMessages, setAiMessages] = useState([]);
 
  const [query, setQuery] = useState("");
  const [chatQuery, setChatQuery] = useState("");
  const { userList, getUserList } = useUser();
  const { user } = useContext(AuthContext);
  const { cid, rid } = useParams();
  // console.log("receiverId id:", rid);
  // console.log("cid:", cid)

  //console.log(messages)
  const navigate = useNavigate();
  const socket = useSocket();


  const copyRef = useRef();

  const createChat = async () => {
    try {
      if (rid) {
        const result = await axios.post(
          `${import.meta.env.VITE_BACKEND_API}/chats/oneononechat/${rid}`,
          {},
          {
            withCredentials: true,
          }
        );
        setOneOnOneChatInfo(result.data.data);
      }
    } catch (error) {
      console.error("Error to retrive chat", error);
    }
  };

  const onConnect = () => {
    setIsConnected(true);
  };

  const onDisconnect = () => {
    setIsConnected(false);
  };

  // send message
  const sendMessage = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/messages/create-message/${cid}`,
        { content: message },
        {
          withCredentials: true,
        }
      );

      socket.emit("typing", cid);
      //console.log("message", response.data.data.response);
      setMessage("");
    } catch (error) {
      console.error("error to send message", error);
    }
  };

  //Get Chat Messages
  const getChatMessages = async () => {
    try {
      setLoading(true);
      if (!cid) {
        return alert("No chat is selected");
      }

      if (!socket) {
        return alert("Soocket is not avialable");
      }

      socket.emit("joinChat", cid);
      socket.emit("joinAiChat", aiChatId);

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/messages/get-messages/${cid}`,
        {
          withCredentials: true,
        }
      );
      //console.log("getting chat messages:", response.data.data);
      setMessages(response.data.data);
    } catch (error) {
      console.error("Error to get chat messages", error);
    } finally {
      setLoading(false);
    }
  };

  // message receive event
  const onMessageReceived = (newMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  // ai message receive event

  const onAiMessageReceived = (newAiMessage) => {
    setAiMessages((prevMsg) => [...prevMsg, newAiMessage]);
  };

  //message delete event
  const onMessageDeleted = (messageId) => {
    setMessages((prevMsg) =>
      prevMsg.filter((msg) => msg._id !== messageId._id)
    );
    console.log("Deleted message with ID:", messageId._id);
  };

  useEffect(() => {
    if (chatQuery) {
      setQuery(chatQuery);
    } else setQuery("");
  }, [chatQuery]);


  useEffect(() => {
    if (cid) {
      createChat();
    }
  }, [cid]);

  useEffect(() => {
    getUserList();
  }, []);

  useEffect(() => {
    if (cid) {
      getChatMessages();
    }
  }, [cid, rid]);

  useEffect(() => {
    if (!socket) return;

    socket.on("connected", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("messageReceived", onMessageReceived);
    socket.on("receivedAiMessage", onAiMessageReceived);
    socket.on("messageDelete", onMessageDeleted);

    return () => {
      socket.off("connected", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("messageReceived", onMessageReceived);
      socket.off("receivedAiMessage", onAiMessageReceived);
      socket.off("messageDelete", onMessageDeleted);
    };
  });

  const clickedChatInfo = () => {
  setIsClickedChatInfo(!isClickedChatInfo);

    const getRoomInfo = async () => {
      try {
        const result = await axios.get(
          `${import.meta.env.VITE_BACKEND_API}/chats/room-info/${cid}`,
          {
            withCredentials: true,
          }
        );
        //console.log("room info", result.data.data);
        setRoomInfo(result.data.data);
      } catch (error) {
        console.error("error to fetch room info");
      }
    };

    if (cid && !rid) {
      getRoomInfo();
    }
  };

  const clickedAiChat = async () => {
    setIsClickedAiChat(true);
    const result = await axios.post(
      `${import.meta.env.VITE_BACKEND_API}/ai-chats/create-aichat/${cid}`,
      {},
      { withCredentials: true }
    );
    setAiChatId(result.data.data?._id);
  };

  const clickedChat = () => {
    setIsClickedAiChat(false);
  };

  const editingRoomName = () => {
    setIsRenameRoom(true);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (e.target.checked) {
      setAddUser(val);
    } else {
      setAddUser("");
    }
  };

  const ClickedonAddUser = () => {
    setIsClickedOnAddUser(true);
  };

  const handleAddUser = async () => {
    console.log(addUser);
    await axios.patch(
      `${import.meta.env.VITE_BACKEND_API}/chats/add-participant`,
      { cid: cid, participantId: addUser },
      { withCredentials: true }
    );
  };

  const handleDeleteOnOneChat = async () => {
    await axios.delete(
      `${import.meta.env.VITE_BACKEND_API}/chats/delete-chat/${cid}`,
      { withCredentials: true }
    );
    navigate("/app");
  setIsClickedChatInfo(false);
  };

  const sendQuery = async (e) => {
    e.preventDefault();

    if (aiChatId) {
      await axios.post(
        `${
          import.meta.env.VITE_BACKEND_API
        }/ai-messages/create-chat/${aiChatId}`,
        { query },
        { withCredentials: true }
      );
      // setAiMessages((prevMsg) => [...prevMsg, {content: query, sender:{role: "user", user: user._id}}]);
      setQuery("");
    }
  };

  const getAiChatMessages = async () => {
    try {
      setLoading(true);
      if (aiChatId) {
        const result = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_API
          }/ai-messages/get-messages/${aiChatId}`,
          { withCredentials: true }
        );

        setAiMessages(result.data.data);
      }
    } catch (error) {
      console.error("error to get ai messages", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatQuery = (cq) => {
    setChatQuery(`${cq} : `);
    setIsClickedAiChat(true);
  };

 

  // delete message
  const deleteMessage = async (mid) => {
    axios.delete(
      `${
        import.meta.env.VITE_BACKEND_API
      }/messages/delete-message/${cid}/${mid}`,
      { withCredentials: true }
    );
    socket.emit("messageDelete", cid);
    console.log("cid", cid);
    //setMessages(prevMsg => prevMsg.filter(msg => msg._id !== cid))
    setViewMessageOptions(false);
  };

  useEffect(() => {
    getAiChatMessages();
  }, [aiChatId]);


  //console.log("ai msg", aiMessages);

  console.log("query:",query);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };
  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };
 

  const handleRenameRoom = async (e) => {
    e.preventDefault();
    const result = await axios.patch(
      `${import.meta.env.VITE_BACKEND_API}/chats/rename-room/${cid}`,
      { name: newRoomName },
      { withCredentials: true }
    );
    setIsRenameRoom(false);
  };

const handleDeleteRoom = async () => {
  await axios.delete(
    `${import.meta.env.VITE_BACKEND_API}/chats/delete-room/${cid}`,
    { withCredentials: true }
  );
};

 

const RemoveUser = async (userId) => {
  await axios.patch(
    `${import.meta.env.VITE_BACKEND_API}/chats/remove-participant`,
    { cid: cid, participantId: userId },
    { withCredentials: true }
  );
 
};


  return (
    <div className=" h-svh w-svw bg-slate-900">
        <ChatHeader clickedChat={clickedChat} isClickedAiChat={isClickedAiChat} clickedAiChat ={clickedAiChat} clickedChatInfo={clickedChatInfo}
          oneOnOneChatInfo={oneOnOneChatInfo}
         handleDeleteOnOneChat={handleDeleteOnOneChat}
         isClickedChatInfo={isClickedChatInfo}
        roomInfo={roomInfo}
        rid={rid}
        cid={cid}
        RemoveUser={RemoveUser}
        handleDeleteRoom={handleDeleteRoom}
        handleRenameRoom={handleRenameRoom}
        />

      <div>
        {!isClickedAiChat ? (
          <div className=" h-svh">
            <ChatDisplay
        
        isClickedAiChat={isClickedAiChat}
        clickedChat={clickedChat}
        
        clickedAiChat={clickedAiChat}
    
        editingRoomName={editingRoomName}
        ClickedonAddUser={ClickedonAddUser}
       
        isClickedOnAddUser={isClickedOnAddUser}
        handleInputChange={handleInputChange}
        setIsClickedOnAddUser={setIsClickedOnAddUser}
        handleAddUser={handleAddUser}
        handleChatQuery={handleChatQuery}
        deleteMessage={deleteMessage}
        loading={loading}
        messages={messages}
      />
            <Input
              value={message}
              onChange={handleMessageChange}
              placeholder="start Chat"
              disabled={!message}
              onSubmit={sendMessage}
            />
          </div>
        ) : (
          <div className=" h-svh">
            <ChatDisplay 
            deleteMessage={deleteMessage}
            setIsClickedAiChat={setIsClickedAiChat}
            
            loading={loading}
            messages={aiMessages}
            />

            <Input
              value={query}
              onChange={handleQueryChange}
              placeholder="start Ai Chat"
              disabled={!query}
              onSubmit={sendQuery}
            />
          </div>
        )}
      </div>
    </div>
  );
}
