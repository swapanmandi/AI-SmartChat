import React, { useState } from "react";
import Prompt from "./Prompt.jsx";
import axios from "axios";

export default function Chat() {
  const [receivedObj, setReceivedObj] = useState(null);
  const [messages, setmessages] = useState([]);

  const getResponse = async (obj) => {
    setReceivedObj(obj);
    try {
      const res = await axios.post("http://localhost:8000/chat", {
        receivedObj,
      });

      setmessages([
        ...messages,
        { sender: "user", message: receivedObj.data },
        { sender: "model", message: res.data.chat },
      ]);
    } catch (error) {
      console.log("Error while receiving data", error);
    }
  };

  console.log("quer", messages);

  return (
    <div className="h-screen bg-gray-100 flex flex-col justify-between w-full max-w-md mx-auto border border-gray-300 rounded-lg p-4">
      <div className="overflow-y-auto flex-grow mb-4">
        {messages.map((item, index) => (
          <div
            key={index}
            className={` ${
              item.sender === "model"
                ? "flex justify-start"
                : "flex justify-end"
            }   mb-2`}
          >
            <div className=" bg-white text-black rounded-lg p-2 max-w-xs break-words shadow-md">
              <h3 className=" flex-wrap">{item.message}</h3>
            </div>

          </div>
        ))}
      </div>
      <Prompt receivedCode={getResponse} />
    </div>
  );
}
