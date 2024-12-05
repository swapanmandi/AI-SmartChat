import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

export default function Settings() {
  const [isClickedPersonal, setIsClickedPersonal] = useState(false);
  const [isClickedEdit, setIsClickedEdit] = useState(false);
  const [isChangeAvatar, setIsChangeAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [user, setUser] = useState(null);

  const { handleSubmit, register } = useForm();

  //console.log("user", user);

  const handleCancelEdit = () => {
    setIsClickedEdit(false);
  };
  const handleSaveEdit = () => {};

  const handleAvatarChange = () => {
    setIsChangeAvatar(true);
  };

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
    <div className=" w-full h-full bg-slate-400 pb-5 ">
      <h3 className=" w-full text-center p-2">Settings</h3>

      <ol>
        <li
          className=" p-2 bg-slate-800 "
          onClick={() => setIsClickedPersonal(!isClickedPersonal)}
        >
          Personal
        </li>

        {isClickedPersonal && (
          <div className="profile-settings lg:max-h-72 flex flex-col p-4 space-y-4 overflow-y-scroll">
            {/* Section Title */}
            <header>
              <ul className="section-title">
                <li className="w-full text-center font-semibold text-lg">
                  Personal Settings
                </li>
              </ul>
            </header>

            {/* Avatar and Upload Section */}
            <section className=" w-full avatar-upload bg-slate-500 flex justify-between  space-x-4 p-4 rounded-lg">
              {/* Avatar Display */}
              <div className=" flex justify-between">
                {user?.avatar ? (
                  <div className="avatar h-20 w-20 rounded-full overflow-hidden">
                    <img
                      className="h-full w-full object-cover"
                      src={user?.avatar}
                      alt="User Avatar"
                    />
                  </div>
                ) : (
                  <div className="no-avatar flex justify-center items-center h-20 w-20 bg-gray-300 text-sm text-gray-700 rounded-full">
                    No Image
                  </div>
                )}
                {!isChangeAvatar && (
                  <button
                    className=" self-center bg-slate-950 p-1 rounded-md h-fit w-fit"
                    onClick={handleAvatarChange}
                  >
                    Change
                  </button>
                )}
              </div>
              {/* Avatar Upload Form */}
              {isChangeAvatar && (
                <form
                  className=" upload-form flex  flex-col items-start space-y-2"
                  onSubmit={handleSubmit(handleAvatarUpload)}
                >
                  <input
                    type="file"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("avatar", { required: true })}
                    onChange={handleViewAvatar}
                    className="file-input text-sm "
                  />

                  <div className=" w-fit flex justify-between">
                    <button
                      onClick={() => setIsChangeAvatar(false)}
                      className="save-avatar-button p-2 rounded-md bg-red-300 text-white"
                      type="button"
                    >
                      Cancel
                    </button>

                    <button
                      className="save-avatar-button p-2 rounded-md bg-lime-500 text-white"
                      type="submit"
                    >
                      Save
                    </button>
                  </div>
                </form>
              )}
            </section>

            {/* User Information and Edit Section */}
            <section className="user-info bg-slate-500 p-4 rounded-lg space-y-4">
              {/* User Information */}
              <p className="user-name">
                <span className="font-semibold">Name:</span> {user?.fullName}
              </p>
              <p className="user-email">
                <span className="font-semibold">Email:</span> {user?.email}
              </p>

              {/* Action Buttons */}
              <div className="action-buttons flex justify-between">
                <button
                  className="edit-button p-2 bg-blue-500 text-white rounded-md"
                  onClick={() => setIsClickedEdit(!isClickedEdit)}
                >
                  Edit
                </button>
                <button
                  className="cancel-button p-2 bg-red-500 text-white rounded-md"
                  onClick={() => setIsClickedPersonal(false)}
                >
                  Cancel
                </button>
              </div>

              {/* Edit Form */}
              {isClickedEdit && (
                <form className="edit-form space-y-4">
                  <label className="block">
                    <span className="font-semibold">Name:</span>
                    <input
                      type="text"
                      className="input-field block w-full p-2 rounded-md border border-gray-300 mt-1"
                    />
                  </label>
                  <label className="block">
                    <span className="font-semibold">Email:</span>
                    <input
                      type="text"
                      className="input-field block w-full p-2 rounded-md border border-gray-300 mt-1"
                    />
                  </label>
                  <div className="edit-action-buttons flex justify-between">
                    <button
                      className="cancel-edit-button p-2 bg-gray-400 text-white rounded-md"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                    <button
                      className="save-edit-button p-2 bg-green-500 text-white rounded-md"
                      onClick={handleSaveEdit}
                    >
                      Save
                    </button>
                  </div>
                </form>
              )}
            </section>
          </div>
        )}
      </ol>
    </div>
  );
}
