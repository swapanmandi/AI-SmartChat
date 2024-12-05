import React from "react";

export default function Loader() {
  return (
    <div className=" bg-slate-900 h-svh w-svw flex justify-center items-center">
      <div className=" animate-ping">Loading...</div>
    </div>
  );
}
