import React, { useState } from "react";
import LeftSidebar from "../components/LeftSidebar";
import Prompt from "../components/Prompt";
import Chat from "../components/Chat";
import ChatApp from "../sample";
import Header from "../components/Header";

export default function Home() {
  const [isOpenedSideNavigation, setIsOpenedSideNavigation] = useState(false);

  return (
    <>
      <div className=" text-white bg-slate-900 overflow-hidden fixed">
        <div className=" flex justify-between p-3 lg:justify-end  lg:flex">
        <button
          className={` lg:hidden ${
            !isOpenedSideNavigation ? "flex" : "invisible"
          }`}
          onClick={() => setIsOpenedSideNavigation(true)}
        >
          O
        </button>
        <button className=" flex items-end justify-end">Profile</button>
        </div>
        {isOpenedSideNavigation && (
          <span
            className=" absolute z-10 top-1 p-2 pl-3"
            onClick={() => setIsOpenedSideNavigation(false)}
          >
            X
          </span>
        )}

        <div className="">
          {" "}
          <Header />
        </div>

        <div className=" flex flex-col h-fit w-screen lg:flex lg:flex-row lg:justify-start ">
          <div
            className={` lg:flex ${isOpenedSideNavigation ? "flex" : "hidden"}`}
          >
            <LeftSidebar />
          </div>

          <div className=" min-h-screen  lg:w-3/4 h-fit">
            <Chat />
          </div>
        </div>
      </div>
    </>
  );
}
