import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { signOut } from "../utils/signOut"; // Import the signOut function

const UserNavigationPanel = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);

  return (
    <div className="w-64 bg-white absolute mt-2 right-0 border border-gray-100 overflow-hidden duration-200">
      {auth?.user?.username && (
        <>
          {(auth.user.role === "admin" || auth.user.role === "HR") && (
            <Link
              to={`user/${auth.user.username}/settings/edit-category`}
              className="text-zinc-500 hover:bg-gray-200 p-4 block opacity-75 pl-8"
            >
              Create Category
            </Link>
          )}

          <Link
            to={`/dashboard/notification`}
            className="sm:hidden text-zinc-500 text-left hover:text-black hover:bg-gray-200 p-4 block opacity-75 pl-8"
          >
            Notifications
          </Link>
          <Link
            to={`user/${auth.user.username}/my-issues`}
            className="hidden text-zinc-500 text-left hover:text-black hover:bg-gray-200 p-4 sm:block opacity-75 pl-8"
          >
            {auth.user.role === "admin" && "All Issues"}
            {auth.user.role === "employee" && "My Issues"}
          </Link>
          {auth.user.role === "admin" && (
            <Link
              to={`user/${auth.user.username}/manage`}
              className="hidden text-zinc-500 text-left hover:text-black hover:bg-gray-200 p-4 sm:block opacity-75 pl-8"
            >
              User Manage
            </Link>
          )}
          {auth.user.role === "employee" && (
            <Link
              to={`user/${auth.user.username}/request`}
              className="hidden text-zinc-500 text-left hover:text-black hover:bg-gray-200 p-4 sm:block opacity-75 pl-8"
            >
              Report Issue
            </Link>
          )}

          <Link
            to={`user/${auth.user.username}/settings/edit-profile`}
            className="text-zinc-500 text-left hover:text-black hover:bg-gray-200 p-4 block opacity-75 pl-8"
          >
            Account Settings
          </Link>
          <hr />
          <button
            onClick={() => signOut(setAuth, navigate)}
            className="w-full p-4 py-4 pl-8 text-left hover:bg-gray-100 "
          >
            <h1 className="text-red-500 font-semibold">Sign Out</h1>
            <p className="text-gray-500">@{auth.user.username}</p>
          </button>
        </>
      )}
    </div>
  );
};

export default UserNavigationPanel;
