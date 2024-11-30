import React, { useState } from "react";
import { useAuth } from "../store/AuthContext.jsx";
import { Link } from "react-router-dom";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const { signup } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const result = signup(fullName, email, password);
      setMessage(result?.data?.message);
    } catch (error) {
      setMessage(error.result?.message || "Register error");
    }
  };

  return (
    <>
      <div className=" bg-red-300 h-screen w-screen items-center flex justify-center">
        <div className=" w-11/12 h-3/6 bg-slate-500 lg:h-5/6 lg:w-6/12 items-center flex flex-col p-3">
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit} className=" flex flex-col items-center">
            <label className="flex flex-col lg:flex m-2 lg:items-center lg:flex-row">
              Name:
              <input
                className=" text-black rounded-md m-2 h-8 w-72"
                type="text"
                onChange={(e) => setFullName(e.target.value)}
                value={fullName}
              ></input>
            </label>

            <label className="flex flex-col lg:flex m-2 lg:items-center lg:flex-row">
              Email:
              <input
                className=" text-black rounded-md m-2 h-8 w-72"
                type="text"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              ></input>
            </label>

            <label className="flex flex-col lg:flex lg:flex-row m-2 lg:items-center">
              Password:
              <input
                className=" text-black rounded-md m-2 h-8 w-72"
                type="text"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              ></input>
            </label>

            <button
              className=" w-20 rounded-md p-1 m-3 bg-red-600"
              type="submit"
            >
              Sign Up
            </button>
          </form>
          <p>
            Have a ccount? Please
            <Link to="/signin">
              <strong>Sign In</strong>
            </Link>
          </p>
          <span className=" mt-5">{message}</span>
        </div>
      </div>
    </>
  );
}
