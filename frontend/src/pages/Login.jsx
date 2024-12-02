import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../store/AuthContext.jsx";

export default function Login() {
  const [email, setEmail] = useState("sm.com");
  const [password, setPassword] = useState("12345");

  const { signin } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signin(email, password);
    } catch (error) {
      console.log("error happening", error);
    }
  };

  return (
    <>
      <div className=" w-full h-screen bg-red-200 flex  justify-center items-center content-center">
        <div className=" p-4 w-11/12 rounded-sm bg-slate-600 lg:h-96 lg:w-3/6 justify-center flex  flex-col text-center lg:items-center">
          <h2>SIGN IN</h2>
          <form
            onSubmit={handleSubmit}
            className=" lg:flex lg:flex-col lg:items-center"
          >
            <label className=" flex flex-col m-4 lg:flex  lg:flex-row lg:text-center text-left lg:items-center">
              Email:
              <input
                className=" text-black rounded-md h-8 w-1/2 p-3  m-2"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              ></input>
            </label>

            <label className=" flex flex-col m-4 lg:flex lg:items-center lg:text-center text-left lg:flex-row">
              Password:
              <input
                className=" text-black rounded-md h-8 w-1/2 p-3 m-2"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              ></input>
            </label>

            <div className=" flex ">
              <button className=" bg-sky-400 p-1 rounded-md m-3" type="submit">
                Sign In
              </button>
            </div>
          </form>
          <h2>
            Don't have account. Please{" "}
            <Link to="/signup">
              <strong>SignUp</strong>
            </Link>
            here.
          </h2>
          <Link to="/">
            <h2>Back To Home Page</h2>
          </Link>
          <span className={` mt-5`}></span>
        </div>
      </div>
    </>
  );
}
