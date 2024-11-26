import React, { useState } from "react";
import { useRef } from "react";

export default function Input({
  value,
  onChange,
  placeholder,
  disabled,
  onSubmit,
  onchangeAddImage,
  imageUrl,
}) {
  const [isClickedAddFile, setIsClickedAddFile] = useState(false);

  //console.log("img", image)

  const addImageRef = useRef(null);

  const handleClickAddImage = () => {
    addImageRef.current.click();
  };

  return (
    <div className=" h-[10%] flex justify-center items-center rounded-md ">
      <form
        onSubmit={onSubmit}
        className=" bg-blue-500 h-full rounded-md flex justify-center items-center  lg:w-2/3"
      >
        <div className={` pr-5`}>
          <svg
            onClick={() => setIsClickedAddFile(!isClickedAddFile)}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            class="icon icon-tabler icons-tabler-outline icon-tabler-file-plus"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M14 3v4a1 1 0 0 0 1 1h4" />
            <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
            <path d="M12 11l0 6" />
            <path d="M9 14l6 0" />
          </svg>

          <div className=" absolute bottom-14">
            {isClickedAddFile && (
              <div>
                <ul className=" bg-slate-950 p-2 rounded-md">
                  <input
                    ref={addImageRef}
                    className=" hidden"
                    type="file"
                    onChange={onchangeAddImage}
                  ></input>

                  <li
                    onClick={handleClickAddImage}
                    className=" p-1 cursor-pointer"
                  >
                    Image
                  </li>
                  <li className=" p-1 cursor-pointer">Video</li>
                  <li className=" p-1 cursor-pointer">Document</li>
                </ul>
              </div>
            )}

            <div className=" ">
              {imageUrl && (
                <div className=" bg-slate-950 rounded-md p-2 h-60 w-52 overflow-hidden">
                  <img src={imageUrl}></img>
                  <div className=" items-center p-2">
                    <svg
                      onClick={handleClickAddImage}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      class="icon icon-tabler icons-tabler-outline icon-tabler-photo-plus"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M15 8h.01" />
                      <path d="M12.5 21h-6.5a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v6.5" />
                      <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l4 4" />
                      <path d="M14 14l1 -1c.67 -.644 1.45 -.824 2.182 -.54" />
                      <path d="M16 19h6" />
                      <path d="M19 16v6" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <input
          type="text"
          className=" outline-none line-clamp-3 w-10/12 overflow-y-auto bg-blue-500 text-black"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        ></input>

        <button
          type="submit"
          disabled={disabled}
          className=" text-black bg-amber-600 h-fit w-fit p-1 rounded-md disabled:bg-gray-500"
        >
          Send
        </button>
      </form>
    </div>
  );
}
