import React, { useEffect, useState } from "react";
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
    <div className=" h-full w-full flex justify-center items-center ">
      <div className=" bg-slate-600 h-5/6 justify-center p-4 flex rounded-md w-1/2">
        <div>
          Profile
          {userDetails ? (
            <div className="">
              <img src={userDetails?.data?.avatar}></img>
              <p>
                FullName:{userDetails.data?.fullName || userDetails.fullName}{" "}
              </p>
              <p>Email:{userDetails.data?.email || userDetails.email} </p>
            </div>
          ) : (
            "There is no User"
          )}
        </div>
      </div>
    </div>
  );
}
