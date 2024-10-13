import React, { useState, useRef, useEffect } from "react";
import Chat from "../pages/Chat.jsx";
import Header from "../components/Header.jsx";

export default function Home() {
  //const [isOpenedSideNavigation, setIsOpenedSideNavigation] = useState(false);
  const [clickedMobChat, setClickedMobChat] = useState(false);

  console.log("c m status", clickedMobChat)
  return (
    <>
      <div className=" h-svh fixed w-screen flex flex-col lg:flex-row">
        <div>
          <Header
            setClickedMobChat={setClickedMobChat}
            clickedMobChat={clickedMobChat}
          />
        </div>
        {/* <div className={` ${clickedMobChat ? "hidden" : ""} lg:block`}>
          <LeftSidebar setClickedMobChat={setClickedMobChat} />
        </div> */}

        <div>
          <Chat
            clickedMobChat={clickedMobChat}
            setClickedMobChat={setClickedMobChat}
          />
        </div>
      </div>
    </>
  );
}
