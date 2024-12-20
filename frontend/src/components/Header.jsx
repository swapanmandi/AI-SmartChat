import React, { useContext, useState } from "react";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext, useAuth } from "../store/AuthContext.jsx";

export default function Header({ setClickedMobChat, clickedMobChat }) {
  const navigate = useNavigate();
  const [isClickProfile, setIsClickProfile] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const { signout, token } = useAuth();
  //console.log("token", token)

  const clickProfile = () => {
    console.log("clicked");
    setIsClickProfile((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      signout();
      // Cookies.remove("accessToken");
      // Cookies.remove("refreshToken");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  const handleClickShowHeader = () => {
    setShowHeader(!showHeader);
  };

  const handleClickedBackToChat = () => {
    setClickedMobChat(false);
  };

  return (
    <div className=" items-center flex flex-col justify-center">
      <div
        className={` bg-teal-800 lg:h-full h-fit w-full lg:w-12 lg:flex flex-col items-center p-1 ${
          showHeader ? "flex" : "hidden"
        }`}
      >
        {token && (
          <div className=" w-full items-center flex justify-between flex-col space-y-4">
            <Link to="/app/profile">
              <button className="">
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
            </Link>

            <button
              className={`${isClickProfile && " bg-slate-600"}`}
              onClick={clickProfile}
            >
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

            <div className={`${isClickProfile ? "flex" : "hidden"}`}>
              <ul className=" absolute z-30 bg-slate-600 lg:left-12 flex flex-col">
                <li className="p-2 font-semibold border-b">View Profile</li>
                <li className="p-2 font-semibold border-b">
                  <Link to="/settings">Settings</Link>
                </li>
                <li
                  className="p-2 font-semibold cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </li>
              </ul>
            </div>
          </div>
        )}

        {!token && (
          <div className="flex space-x-4">
            <button className="flex items-end justify-end m-3">
              <Link to="/signup">Sign Up</Link>
            </button>
            <button>
              <Link to="/signin">Sign In</Link>
            </button>
          </div>
        )}
      </div>
      <div className=" flex space-x-72 justify-between">
        {clickedMobChat && (
          <div onClick={handleClickedBackToChat}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-left"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M5 12l14 0" />
              <path d="M5 12l4 4" />
              <path d="M5 12l4 -4" />
            </svg>
          </div>
        )}
        <div onClick={handleClickShowHeader} className=" lg:hidden">
          {showHeader ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-up"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M6 15l6 -6l6 6" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-down"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M6 9l6 6l6 -6" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
