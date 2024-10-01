import React from "react";

export default function Input({
  onSubmit,
  value,
  onChange,
  placeholder,
  disabled,
  onKeyDown
}) {
  return (
    <div className=" h-[10%] flex justify-center items-center rounded-md ">
      <form
        className=" bg-blue-500 h-full rounded-md flex justify-center items-center  lg:w-2/3"
        onSubmit={onSubmit}
      >
        <input
          type="text"
          className=" outline-none line-clamp-3 w-10/12 overflow-y-auto bg-blue-500 text-black"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        ></input>

        <button
          type="submit"
          className=" bg-amber-600 h-fit w-fit p-1 rounded-md disabled:bg-gray-300"
          disabled={disabled}
          onKeyDown={onKeyDown}
        >
          Send
        </button>
      </form>
    </div>
  );
}
