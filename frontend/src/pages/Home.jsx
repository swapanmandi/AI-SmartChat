import React, { useState } from "react";
import LeftSidebar from "../components/LeftSidebar";
import Chat from "../pages/Chat.jsx";

export default function Home() {
  const [isOpenedSideNavigation, setIsOpenedSideNavigation] = useState(false);

  return (
    <>
      <div className=" h-svh fixed w-screen">
        <div className=" flex justify-between lg:justify-end  lg:flex">
          <button
            className={` lg:hidden ${
              !isOpenedSideNavigation ? "flex" : "invisible"
            }`}
            onClick={() => setIsOpenedSideNavigation(true)}
          >
            O
          </button>
        </div>
        {isOpenedSideNavigation && (
          <span
            className=" absolute z-10 top-1 p-2 pl-3"
            onClick={() => setIsOpenedSideNavigation(false)}
          >
            X
          </span>
        )}

        <div className=" flex flex-col lg:flex lg:flex-row lg:justify-start ">
          <div
            className={`lg:flex ${isOpenedSideNavigation ? "flex" : "hidden"}`}
          >
            <LeftSidebar />
          </div>

          <Chat />
        </div>
      </div>
    </>
  );
}
