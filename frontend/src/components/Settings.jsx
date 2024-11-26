import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

export default function Settings() {
  const [isClickedPersonal, setIsClickedPersonal] = useState(false);
  const [isClickedEdit, setIsClickedEdit] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [user, setUser] = useState(null);

  const { handleSubmit, register } = useForm();

  //console.log("user", user);

  const handleCancelEdit = () => {
    setIsClickedEdit(false);
  };
  const handleSaveEdit = () => {};

  const handleViewAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarUpload = async (data) => {
    const formData = new FormData();
    formData.append("avatar", data.avatar[0]);
    await axios.patch(
      `${import.meta.env.VITE_BACKEND_API}/users/avatar`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  };

  const getUser = async () => {
    const result = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/users/currentUser`,
      {
        withCredentials: true,
      }
    );
    setUser(result.data.data);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <div>Settings</div>
      <div>
        <ol>
          <li onClick={() => setIsClickedPersonal(!isClickedPersonal)}>
            Personal
          </li>
          {isClickedPersonal && (
            <div className=" flex flex-col">
              <p>Personal Settings</p>
              <div className=" bg-yellow-200  flex">
                {user?.avatar ? (
                  <div className="h-20 w-20 rounded-full">
                    <img
                      className=" h-full w-full object-cover"
                      src={user?.avatar}
                    ></img>
                  </div>
                ) : (
                  <span className="flex justify-center items-center">
                    No Image
                  </span>
                )}

                <form onSubmit={handleSubmit(handleAvatarUpload)}>
                  <input
                    type="file"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("avatar", { required: true })}
                    onChange={handleViewAvatar}
                  />
                  <button
                    className=" p-2 m-2 rounded-md bg-lime-500"
                    type="submit"
                  >
                    Save
                  </button>
                </form>
              </div>

              <div className=" bg-slate-500">
                <p>
                  Name:
                  {user?.fullName}
                </p>
                <p> Email: {user?.email}</p>
                <div className=" flex justify-between">
                  <button onClick={() => setIsClickedEdit(!isClickedEdit)}>
                    Edit
                  </button>
                  <button onClick={() => setIsClickedPersonal(false)}>
                    Cancel
                  </button>
                </div>

                {isClickedEdit && (
                  <div>
                    <label>
                      {" "}
                      Name:
                      <input type="text"></input>
                    </label>
                    <label>
                      Email: <input type="text"></input>
                    </label>
                    <div className=" flex justify-between">
                      <button onClick={handleCancelEdit}>Cancel</button>
                      <button onClick={handleSaveEdit}>Save</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </ol>
      </div>
    </>
  );
}
