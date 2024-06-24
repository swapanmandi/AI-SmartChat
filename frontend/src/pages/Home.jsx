import React from "react";
import LeftSidebar from "../components/LeftSidebar";
import Prompt from "../components/Prompt";
import Chat from "../components/Chat";
import ChatApp from "../sample";

export default function Home() {
  return (
    <>
    <div className=" bg-slate-900 w-auto">
      <div className=" text-white">
        <li className=" flex p-3">
          <ul className=" bg-red-300 rounded-md p-1 m-2">Explain Code</ul>
          <ul className=" bg-red-300 rounded-md p-1 m-2">Summarizer</ul>
          <ul className=" bg-red-300 rounded-md p-1 m-2">Translation</ul>
          <ul className=" bg-red-300 rounded-md p-1 m-2">Question Answering</ul>
          <ul className=" bg-red-300 rounded-md p-1 m-2">Explanation</ul>
          <ul className=" bg-red-300 rounded-md p-1 m-2">Conversation Starting</ul>
          <ul className=" bg-red-300 rounded-md p-1 m-2">Data Analysis</ul>
          <ul className=" bg-red-300 rounded-md p-1 m-2">Solution</ul>
          <ul className=" bg-red-300 rounded-md p-1 m-2">Chat</ul>
          <ul className=" bg-orange-500 rounded-md p-1 m-2">New Chat</ul>
        </li>
        
      </div>
      <div className=" h-fit w-screen flex justify-start">
        <LeftSidebar />
        <div className=" min-h-screen  w-screen h-fit">
          <Chat />
        </div>

        {/* <ChatApp /> */}
      </div>
      </div>
    </>
  );
}
