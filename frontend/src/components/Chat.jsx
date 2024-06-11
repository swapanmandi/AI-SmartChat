import React, { useState } from "react";
import Prompt from "./Prompt.jsx";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Markdown from 'react-markdown'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {dark} from 'react-syntax-highlighter/dist/esm/styles/prism'


export default function Chat() {
  const [messages, setmessages] = useState([]);

  const getResponse = async (obj) => {
    try {
      const res = await axios.post("http://localhost:8000/chat", {
        receivedObj: obj,
      });

      setmessages([
        ...messages,
        { sender: "user", message: obj.data },
        { sender: "model", message: res.data.chat },
      ]);
    } catch (error) {
      console.log("Error while receiving data", error);
    }
  };

  console.log("quer", messages);

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

  return (
    <div
      id="pdfContainer"
      className=" overflow-y-auto bg-gray-950  h-screen flex flex-col border border-gray-300 rounded-lg p-4"
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
            <div className=" overflow-auto text-center items-center p-1 bg-white text-black rounded-lg">
              {/* <p className="">{item.message}</p> */}
          
              <Markdown
    children={item.message}
    components={{
      code(props) {
        const {children, className, node, ...rest} = props
        const match = /language-(\w+)/.exec(className || '')
        return match ? (
          <SyntaxHighlighter
            {...rest}
            PreTag="div"
            children={String(children).replace(/\n$/, '')}
            language={match[1]}
            style={dark}
          />
        ) : (
          <code {...rest} className={className}>
            {children}
          </code>
        )
      }
    }}
  />

            </div>
          </div>
        ))}
      </div>
      {messages.length >= 5 && (
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
