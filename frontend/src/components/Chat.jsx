import React, { useEffect, useRef, useState } from "react";
import Prompt from "./Prompt.jsx";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useParams } from "react-router-dom";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(uuidv4());
  const [oldChat, setOldChat] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null) ;
  const[copied, setCopied] = useState(false)

  const { id } = useParams();

  console.log("id", id);
  console.log("sess", sessionId);
  
  if (sessionId !== id) {
    setSessionId(id);
  }

  const handleQueryBtn = async (e) => {
    e.preventDefault();
    if (id) {
      setSessionId(id);
    }

    const response = await axios.post(
      "http://localhost:8000/chat/generateChat",
      {
        sessionId,
        message,
      },
      {
        withCredentials: true,
      }
    );
    //console.log("message", response.data.data.response)

    setMessages([
      ...messages,
      { sender: "user", chat: message },
      { sender: "model", chat: response.data.data.response },
    ]);

    setMessage("");
  };

  //get old chat

  const getOldChat = async (req, res) => {
    const response = await axios.get(
      `http://localhost:8000/chat/chatHistory/${id}`,
      {
        withCredentials: true,
      }
    );

    console.log("old chat:", response.data.data);

    setOldChat(response.data.data);
  };

  useEffect(() => {
    if (id) {
      getOldChat();
    }
  }, [sessionId]);


  //copy to clipboard handle

  const copyToClipboard = (item,code, index)=>{
   
  
    navigator.clipboard.writeText(item)
    .then(() =>{
      setCopiedIndex(index)

      setTimeout(()=>{
        setCopiedIndex(null)
      }, 2000)
    })
    .catch(err =>{
      console.log("error tp copy text")
    })
  }



   
  return (
    <>
      <div className=" bg-slate-900 lg:h-screen lg:w-full overflow-auto flex flex-col">
        <div className=" h-[75%] overflow-y-auto">
          {id && (
            <div className="lg:h-fit w-full">
              {oldChat?.map((item, index) => (
                <div
                  key={index}
                  className={` ${
                    item.sender === "model"
                      ? "flex justify-start"
                      : "flex justify-end"
                  }  p-2 rounded-md`}
                >
                  <p className=" bg-emerald-600 rounded-md p-2">
                  
{/* markDown goes here */}
                    {/* {item.message} */}


                    <Markdown
    children={item.message}
    components={{
      code(props) {
        const {children, className, node, ...rest} = props
        const match = /language-(\w+)/.exec(className || '')
        
        return match ? (
          <div className="">
          <SyntaxHighlighter
          
            {...rest}
            PreTag="div"
            children={String(children).replace(/\n$/, '')}
            language={match[1]}
            style={dark}
            
          >
            {String(children).trim()}
             </SyntaxHighlighter>
             { item.sender === "model" && <div className=" flex justify-end top-0 right-0">
            <button onClick={()=> copyToClipboard(String(children).trim(), 'code', index)} className="w-14 h-6 bg-green-500 rounded-md  right-0">{copiedIndex === index ? "Copied" : "Code"}</button>
            </div>
          }
           </div>
        ) : (
          <code {...rest} className={className}>
         
            {children}
          </code>
        )
       
      }
      
    }}
    
  />


{/* markdown ends here */}

{/* copy text button */}

{ item.sender === "model" && <div className=" flex justify-end right-0">
<CopyToClipboard text={item.message}><button   className="w-14 h-6 bg-yellow-500 rounded-md  right-0">Copy</button></CopyToClipboard>
</div>

}


                  </p>
                 
                </div>
              ))}
            </div>
          )}

          <div className=" lg:h-fit w-full mb-20">
            {messages?.map((item, index) => (
              <div
                key={index}
                className={`${
                  item.sender === "model"
                    ? "flex justify-start"
                    : "flex justify-end"
                }  p-2 rounded-md`}
              >
                <p className=" bg-emerald-600 rounded-md p-2">{item.chat}
                  
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center items-center bottom-10 rounded-md lg:min-h-24 lg:w-full overflow-hidden ">
          <form
            className=" bg-blue-500 rounded-sm p-1 flex justify-around items-center lg:w-1/2"
            onSubmit={handleQueryBtn}
          >
            <textarea
              className=" outline-none line-clamp-3  m-2 p-3 w-10/12 overflow-y-auto bg-blue-500 text-black"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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
