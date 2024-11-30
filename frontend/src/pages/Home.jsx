import React from "react";
import Header from "../components/Header";
import LeftSidebar from "../components/LeftSidebar";

export default function Home() {
  return (
    <div className=" flex h-full w-full flex-col lg:flex-row ">

      <div className=" w-full lg:w-96">
        <LeftSidebar />
      </div>

      <div className=" bg-red-500 h-full w-full flex items-center justify-center">
        <div className=" text-center">
        <h2>Select a Chat and Start Messeging with</h2>
        <h1>SMART AI CHAT APP</h1>
        </div>
      </div>
    </div>
  );
}
