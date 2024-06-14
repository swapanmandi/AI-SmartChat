import React, { useRef, useState } from "react";
import Prompt from "./Prompt.jsx";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [copyStatus, setCopyStatus] = useState(false);
const [copyText, setCopyText] = useState('');
const copyRef = useRef(null)
  //getting backend response

  const getResponse = async (obj) => {
    try {
      const res = await axios.post("http://localhost:8000/chat", {
        receivedObj: obj,
      });

      // setMessages([
      //   ...messages,
      //   { sender: "user", message: obj.data },
      //   { sender: "model", message: res.data.chat },
      // ]);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", message: obj.data },
        { sender: "model", message: res.data.chat },
      ]);
    } catch (error) {
      console.log("Error while receiving data", error);
    }
  };

  //end of backend

  //generate pdf
  const generatePdf = () => {
    const input = document.getElementById("pdfContainer");
    html2canvas(input, { scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight;
        }
        pdf.save("chatMessage.pdf");
      })
      .catch((error) => {
        console.log("Error to generate Pdf.", error);
      });
  };
  //end of generate pdf

  //handle copy button
  const handleCopy = () => {
    setCopyStatus(true);

    setTimeout(() => {
      setCopyStatus(false);
    }, 2000);
  };

  //end of handle copy btn

  //handle text copy
  const handleCopyText = () =>{
    if(copyRef.current){
      navigator.clipboard.writeText(copyRef.current.innerText)
      .then(() =>{
        setCopyStatus(true);
        setTimeout(()=>{
          setCopyStatus(false)
        }, 2000)
      })
      .then(err => 'Error to copy', error)
    }
  }

  return (
    <div
      id="pdfContainer"
      className=" overflow-y-auto bg-red-600  h-screen flex flex-col border border-gray-300 rounded-lg p-4"
    >
      <div className=" mb-4">
        {messages.map((item, index) => (
          <div
            key={index}
            className={` ${
              item.sender === "model"
                ? "flex justify-start w-fit"
                : "flex justify-end"
            }   mb-2`}
          >
            {item.sender === 'model' && (<div> 
             <div className=" hidden" id="text" ref={copyRef}> <Markdown>{item.message}</Markdown> </div>
            </div>)}

            <div className=" overflow-auto text-center items-center p-1 bg-white text-black rounded-lg">
              {/* <p className="">{item.message}</p> */}

              <Markdown
                children={item.message}
                components={{
                  code(props) {
                    const { children, className, node, ...rest } = props;
                    const match = /language-(\w+)/.exec(className || "");
                    const codeString = String(children).replace(/\n$/, "");

                    return match ? (
                      <div >
                        {/* //for copying code */}
                        <CopyToClipboard text={codeString} onCopy={handleCopy}>
                          <button className=" bg-emerald-500">Copy</button>
                        </CopyToClipboard>

                        <SyntaxHighlighter
                          {...rest}
                          PreTag="div"
                          //children={String(children).replace(/\n$/, '')}
                          language={match[1]}
                          style={dark}
                        >
                          {codeString}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code {...rest} className={className}>
                        {children}
                      </code>
                    );
                  },
                }}
              />
            </div>
        {
          item.sender === 'model' && (<button onClick={handleCopyText}>Copy</button>)
        }
          </div>
        ))}
      </div>
      {copyStatus && (
        <span className=" justify-center items-center flex bg-slate-500 h-8 rounded-md shadow-md w-20  translate-y-6 bottom-10 right-4 fixed">
          <h2>Copied</h2>
        </span>
      )}

      {messages.length >= 4 && (
        <button
          onClick={generatePdf}
          className=" z-10 bg-slate-600 w-fit p-2 rounded-full"
        >
          PDF
        </button>
      )}
      <Prompt receivedCode={getResponse} />
    </div>
  );
}
