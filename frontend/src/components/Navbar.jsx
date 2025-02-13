import React, { useContext, useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { AuthContext } from "../context/AuthContext";
import UserNavigationPanel from "./UserNavigationPanel";
import axios from "axios";
import AnimationWrapper from "./AnimationWrapper";
import { slugify } from "../utils/slugify";

const Navbar = () => {
  const [userNavPanel, setuserNavPanel] = useState(false);
  const [isclicked, setIsClicked] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(""); // For error handling
  const { auth } = useContext(AuthContext);

    // const title = data.issueDetails.issueTitle;

  // Debounce function to limit API calls
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const handleblur = () => {
    setTimeout(() => {
      setuserNavPanel(false);
    }, 100);
  };

  // Fetch data from backend
  const fetchData = async (searchTerm) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(import.meta.env.VITE_BACKEND_URL + `/search/requests?term=${searchTerm}`);
      console.log(response.data);
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setError("Failed to fetch results. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Debounced version of the fetch function
  const debouncedFetchData = debounce((term) => {
    if (term.trim() !== "") fetchData(term);
    else setRequests([]); // Clear results if input is empty
  }, 500); // 500ms delay

  // Handle input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedFetchData(value); // Trigger search
  };

  return (
    <AnimationWrapper>
      <div className="absolute top-0 z-50 w-full flex items-center justify-between h-24 px-4 lg:px-20 py-2 bg-white border-b-[1px] border-zinc-200">
        <div className="flex items-center gap-5">
          <Link to="/" className="w-24">
            <img className="w-full h-full" src={logo} alt="" />
          </Link>
          {auth.token && (
          <div className="relative hidden sm:block">
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Search here..."
              className="border-2 pl-4 pr-10 py-2 rounded-md"
            />
            {loading && (
              <div className="absolute right-2 top-[10px] text-gray-500">
                Loading...
              </div>
            )}
            {/* Show search results */}
            {requests.length > 0 && (
              <div className="absolute max-h-52 overflow-auto z-50 bg-white border border-gray-300 rounded-md mt-2 p-2 shadow-lg w-[400px]">
                {requests.map((request, index) => (
                  <Link to={`/request/${auth.user._id}/${slugify(request.issueDetails.issueTitle)}/ticket/${request.issueTicket}`}
                    key={index}
                    className="py-1 px-2 h-12 flex justify-between  hover:bg-gray-100 text-ellipsis overflow-hidden"
                    onClick={() => {setRequests([]); setSearchInputs("");}}
                  >
                    <span className="w-48 h-full text-ellipsis line-clamp-1 overflow-hidden">{request.issueDetails.issueTitle || "No Title Available"}</span>
                    <div className="flex flex-col items-end">
                      {/* <span className="">{request.category.categoryName}</span> */}
                      <span className="text-sm text-zinc-400">@{request.reportedBy?.personalInfo?.username}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            {/* Show empty state or error message */}
            {searchInput && !loading && requests.length === 0 && !error && (
              <div className="absolute z-50 bg-white border border-gray-300 rounded-md mt-2 p-2 shadow-lg w-[300px]">
                No results found for "{searchInput}"
              </div>
            )}
            {error && (
              <div className="absolute z-50 bg-red-100 border border-red-300 rounded-md mt-2 p-2 shadow-lg w-[300px]">
                {error}
              </div>
            )}
          </div>
        )}
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          {auth.token && (
            <Link to="/dashboard/search" className="sm:hidden block">
              <button className="w-12 h-12 rounded-full bg-gray-100 hover:bg-black/10 relative">
                <i
                  onClick={() => setIsClicked(!isclicked)}
                  className=" block mt-1  text-xl fi fi-rr-search"
                ></i>
              </button>
            </Link>
            
          )}
          
          {auth.token ? (
            <>
              <Link to={`/dashboard/notification`}>
                <button className="hidden sm:block  w-12 h-12 rounded-full bg-gray-100 hover:bg-black/10 relative">
                  <i className="fi fi-rs-bell text-xl block mt-1"></i>
                </button>
              </Link>


              <div className="relative">
                  <button
                    onClick={() => setuserNavPanel(!userNavPanel)}
                    onBlur={handleblur}
                    className="w-12 h-12 mt-1"
                  >
                    <img
                      className="w-full h-full object-cover rounded-full"
                      src={`${auth.user.profile_img}`}
                      alt=""
                    />
                  </button>
                  {userNavPanel && <UserNavigationPanel />}
                </div>

              {/* <div
                onClick={() => setIsClicked(!isclicked)}
                className=" relative text-xl px-5 pr-10 py-2 bg-blue-500 text-white border-2 border-blue-500 rounded-md hover:bg-blue-600 "
              >
                <span>{auth.user.username}</span>
                <i
                  className={`absolute right-2 bottom-1 ${
                    isclicked ? "fi fi-rr-caret-up" : "fi fi-rr-caret-down"
                  }`}
                ></i>
                {isclicked && <UserNavigationPanel />}
              </div> */}



              {/* <button
              onClick={signOut}
              className="hidden sm:block text-xl px-4 py-2 bg-red-500 text-white border-2 border-red-500 rounded-md hover:bg-red-600 "
            >
              <h1 className=" font-semibold">Sign Out</h1>
            </button> */}
            </>
          ) : (
            <Link
              to="/log-in"
              className="hidden sm:block text-xl px-4 py-2 bg-blue-500 text-white border-2 border-blue-500 rounded-md hover:bg-blue-600 "
            >
              <h1 className=" font-semibold">Log In</h1>
            </Link>
          )}
        </div>
        {/* <div>
        <img className="w-full h-full object-cover" src={Logo} alt="Logo" />
      </div>

      {auth.token ? (
        <>
          <div className="relative">
            <button onBlur={handleblur} onClick={()=>setuserNavPanel(!userNavPanel)} className="flex justify-between items-center px-5 py-3 w-[150px] border-[1px] border-zinc-400 rounded-md hover:border-2 hover:border-zinc-800">
              <span>{auth.user.username}</span>
              <span className="mt-1">
                <i className={`${userNavPanel ? "fi fi-rr-caret-up" : "fi fi-rr-caret-down"}`}></i>
              </span>
            </button>
            {userNavPanel && <UserNavigationPanel />}
          </div>
        </>
      ) : (
        <div className="flex gap-5 text-white">
          <Link to="/sign-in">
            <button className="px-4 py-2 rounded-xl hover:bg-black bg-zinc-800">
              Sign-up
            </button>
          </Link>
          <Link className="hidden sm:block" to="/log-in">
            <button className="px-4 py-2 rounded-xl hover:bg-black bg-zinc-800">
              Log-in
            </button>
          </Link>
        </div>
      )} */}
      </div>
    </AnimationWrapper>
  );
};

export default Navbar;
