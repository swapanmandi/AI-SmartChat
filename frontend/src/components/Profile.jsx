import React, { useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../store/AuthContext.jsx";
import { useContext } from "react";

export default function Profile() {
  const [userDetails, setUserDetails] = useState(null);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    setUserDetails(user);
  }, []);

  //console.log("user details", userDetails)

  return (
    <>
      <div className=" z-0 bg-slate-900 text-white absolute h-svh w-svw flex justify-center items-center">
        <div className=" bg-slate-600 h-5/6 justify-center p-4 flex rounded-md w-4/12">
          <div>
            Profile
            {userDetails ? (
              <div className="">
                
                <p>FullName:{userDetails.data?.fullName || userDetails.fullName} </p>
                <p>Email:{userDetails.data?.email || userDetails.email} </p>
              </div>
            ) : (
              "There is no User"
            )}
          </div>
        </div>
      </div>
    </>
  );
}
