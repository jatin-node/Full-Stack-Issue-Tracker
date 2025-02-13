import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const MobileBottomNav = () => {
  const { auth } = useContext(AuthContext);
  const [activeLink, setActiveLink] = useState("home"); // To store the active link

  // Function to handle the click and set the active link
  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  return (
    <div className="flex z-[100] sm:hidden absolute bottom-0 text-zinc-400 w-full h-[10vh] bg-white border-t-[1px] tracking-tight">
      <Link
        to="/"
        className={`w-full flex focus:text-black flex-col justify-center items-center text-2xl ${activeLink === 'home' ? 'text-black' : ''}`}
        onClick={() => handleLinkClick('home')}
      >
        <i className="fi fi-br-home"></i>
        <span className="text-sm font-bold">Home</span>
      </Link>

      {auth.user.role === "admin" && (
        <Link
          to={`user/${auth.user.username}/my-issues`}
          className={`w-full flex focus:text-black flex-col justify-center items-center text-2xl ${activeLink === 'all-issues' ? 'text-black' : ''}`}
          onClick={() => handleLinkClick('all-issues')}
        >
          <i className="fi fi-ss-issue-loupe"></i>
          <span className="text-sm font-bold">All Issues</span>
        </Link>
      )}

      {auth.user.role === "employee" && (
        <Link
          to={`user/${auth.user.username}/my-issues`}
          className={`w-full flex focus:text-black flex-col justify-center items-center text-2xl ${activeLink === 'my-issues' ? 'text-black' : ''}`}
          onClick={() => handleLinkClick('my-issues')}
        >
          <i className="fi fi-ss-issue-loupe"></i>
          <span className="text-sm font-bold">My Issues</span>
        </Link>
      )}

      {auth.user.role === "admin" && (
        <Link
          to={`user/${auth.user.username}/manage`}
          className={`w-full flex focus:text-black flex-col justify-center items-center text-2xl ${activeLink === 'assign-worker' ? 'text-black' : ''}`}
          onClick={() => handleLinkClick('assign-worker')}
        >
          <i className="fi fi-rs-newspaper"></i>
          <span className="text-sm tracking-tighter font-bold">User manage</span>
        </Link>
      )}

      {auth.user.role === "employee" && (
        <Link
          to={`user/${auth.user.username}/request`}
          className={`w-full flex focus:text-black flex-col justify-center items-center text-2xl ${activeLink === 'report-issue' ? 'text-black' : ''}`}
          onClick={() => handleLinkClick('report-issue')}
        >
          <i className="fi fi-rs-newspaper"></i>
          <span className="text-sm font-bold">Report Issue</span>
        </Link>
      )}

      <Link
        to={`user/${auth.user.username}/settings/edit-profile`}
        className={`w-full flex focus:text-black flex-col justify-center items-center text-2xl ${activeLink === 'account' ? 'text-black' : ''}`}
        onClick={() => handleLinkClick('account')}
      >
        <i className="fi fi-sr-user"></i>
        <span className="text-sm font-bold">Account</span>
      </Link>
    </div>
  );
};

export default MobileBottomNav;
