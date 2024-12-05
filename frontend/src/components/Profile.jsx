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
    <div className=" bg-slate-800 h-full w-full justify-center items-center p-2 flex rounded-md">
      
      <div className="profile-container w-4/5 p-4 rounded-lg">
  <h2 className="profile-title text-center text-lg font-bold mb-4">Profile</h2>
  {userDetails ? (
    <div className="profile-content flex flex-col justify-center items-center">
      <img
        src={userDetails?.data?.avatar}
        alt="User Avatar"
        className="profile-avatar rounded-full w-24 h-24 mb-4 shadow-lg"
      />
      <dl className="profile-details text-sm">
        <div className="mb-2">
          <dt className="font-semibold">Full Name:</dt>
          <dd>{userDetails.data?.fullName || userDetails.fullName}</dd>
        </div>
        <div>
          <dt className="font-semibold">Email:</dt>
          <dd>{userDetails.data?.email || userDetails.email}</dd>
        </div>
      </dl>
    </div>
  ) : (
    <p className="no-user-message text-center text-sm text-gray-700">
      There is no user.
    </p>
  )}
</div>

      </div>
   
  );
}
