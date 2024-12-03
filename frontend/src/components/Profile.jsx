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
    <div className=" bg-slate-500 h-full w-full justify-center items-center p-4 flex rounded-md">
      
        <div>
          Profile
          {userDetails ? (
            <div className="">
              <img src={userDetails?.data?.avatar}></img>
              <p>
                FullName:{userDetails.data?.fullName || userDetails.fullName}
              </p>
              <p>Email:{userDetails.data?.email || userDetails.email} </p>
            </div>
          ) : (
            "There is no User"
          )}
        </div>
      </div>
   
  );
}
