import React, { useState } from "react";
import { useAuth } from "../store/AuthContext.jsx";
import Settings from "./Settings.jsx";
import Profile from "./Profile.jsx";

export default function Header() {
  const [isClickProfile, setIsClickProfile] = useState(false);
  const [isClickedSettings, setIsClickedSettings] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [isClickedAccount, setIsClickedAccount] = useState(false);

  const { signout, token } = useAuth();
  //console.log("token", token)

  const clickProfile = () => {
    //console.log("clicked");
    setIsClickProfile((prev) => !prev);
    setIsClickedSettings(false);
  };

  const clickSettings = () => {
    setIsClickedSettings(!isClickedSettings);
    setIsClickProfile(false);
  };

  const handleLogout = async () => {
    try {
      signout();
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  const handleClickShowHeader = () => {
    setShowHeader(!showHeader);
  };

  return (
    <>
      {token && (
        <div
          className={` bg-gray-900 w-full lg:w-12 h-8 lg:h-screen items-center flex flex-col justify-center z-30`}
        >
          <div className=" absolute bg-teal-800 lg:h-full w-full h-8 lg:w-12 lg:flex flex-col items-center">
            <div
              className={` ${showHeader ? "flex" : "hidden lg:flex w-full h-full"} `}
            >
              {token && (
                <div className=" w-full h-full items-center flex justify-between flex-row lg:flex-col  p-1">
                  <div>
                    <button
                      className=" profile "
                      onClick={() => clickProfile()}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="icon icon-tabler icons-tabler-filled icon-tabler-user"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M12 2a5 5 0 1 1 -5 5l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
                        <path d="M14 14a5 5 0 0 1 5 5v1a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-1a5 5 0 0 1 5 -5h4z" />
                      </svg>
                    </button>

                    {isClickProfile && (
                      <div className="absolute inset-0 lg:left-12 w-full h-96  lg:w-96 overflow-hidden ">
                        <Profile />
                      </div>
                    )}
                  </div>


                  <div>
                    <button className=" settings " onClick={clickSettings}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="icon icon-tabler icons-tabler-filled icon-tabler-settings"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M14.647 4.081a.724 .724 0 0 0 1.08 .448c2.439 -1.485 5.23 1.305 3.745 3.744a.724 .724 0 0 0 .447 1.08c2.775 .673 2.775 4.62 0 5.294a.724 .724 0 0 0 -.448 1.08c1.485 2.439 -1.305 5.23 -3.744 3.745a.724 .724 0 0 0 -1.08 .447c-.673 2.775 -4.62 2.775 -5.294 0a.724 .724 0 0 0 -1.08 -.448c-2.439 1.485 -5.23 -1.305 -3.745 -3.744a.724 .724 0 0 0 -.447 -1.08c-2.775 -.673 -2.775 -4.62 0 -5.294a.724 .724 0 0 0 .448 -1.08c-1.485 -2.439 1.305 -5.23 3.744 -3.745a.722 .722 0 0 0 1.08 -.447c.673 -2.775 4.62 -2.775 5.294 0zm-2.647 4.919a3 3 0 1 0 0 6a3 3 0 0 0 0 -6z" />
                      </svg>
                    </button>

                    {isClickedSettings && (
                      <div
                        className={`absolute inset-0 lg:left-12 w-full h-96  lg:w-96`}
                      >
                        <ul className=" bg-slate-600  flex flex-col">
                          <li
                            onClick={() =>
                              setIsClickedAccount(!isClickedAccount)
                            }
                            className="p-2 font-semibold border-b"
                          >
                            Accounts
                          </li>
                          
                          {isClickedAccount && (
                            <div className=" lg:left-96 z-10 absolute w-full lg:w-96 h-fit">
                              <Settings />
                            </div>
                          )}

                          <li className="p-2 font-semibold border-b">
                            General
                          </li>
                          <li className="p-2 font-semibold border-b">Chats</li>
                          <li
                            className="p-2 font-semibold cursor-pointer"
                            onClick={handleLogout}
                          >
                            Logout
                          </li>

                        </ul>

                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className=" bg-slate-950 flex justify-center items-center h-full lg:hidden">
              <svg
                onClick={handleClickShowHeader}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-down"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M6 9l6 6l6 -6" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
