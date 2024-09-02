import React,{useState} from "react";

export default function AiChat() {
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState(null);
  return (
    <>
    <div className=" w-full h-full">
       
      <div className=" h-[75%] overflow-y-auto">
        {chatHistory ? (
          chatHistory?.map((item) => (
            <div
              className={` w-full flex ${
                item.senderId?.fullName === user && "justify-end"
              }`}
            >
              <div className=" h-fit w-fit text-black m-2 flex justify-between">
                <span
                  className={` ${
                    item.senderId?.fullName === user && "hidden"
                  } bg-slate-400 h-8 w-8 rounded-full p-1 m-1`}
                >
                  {" "}
                  {item.senderId?.fullName}{" "}
                </span>

                <span className=" bg-slate-50 rounded-md p-1 m-1">
                  {item.message}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div>Ask Your Query</div>
        )}

        <div className=" w-full flex justify-end">
          {messages?.map((item) => (
            <div className=" bg-slate-50 h-fit w-fit text-black m-2 flex flex-col p-1 rounded-md">
              <span className="">{item}</span>
              <span className=" p-1 m-1">
                {timeFormat(time)} {loading && "🔄"} {sendStatus && "✔"}
              </span>
            </div>
          ))}
        </div>

        <div className=" lg:h-fit w-full mb-20"></div>
      </div>

      <div className="flex justify-center items-center bottom-10 rounded-md lg:min-h-24 lg:w-full overflow-hidden ">
        <form
          className=" bg-blue-500 rounded-sm p-1 flex justify-around items-center lg:w-1/2"
          onSubmit={""}
        >
          <textarea
            className=" outline-none line-clamp-3  m-2 p-3 w-10/12 overflow-y-auto bg-blue-500 text-black"
            value={""}
            onChange={""}
            placeholder="Your Query"
          ></textarea>
          <button className=" bg-amber-600 h-fit w-fit p-2 rounded-md">
            Send
          </button>
        </form>
      </div>
      </div>
    </>
  );
}
