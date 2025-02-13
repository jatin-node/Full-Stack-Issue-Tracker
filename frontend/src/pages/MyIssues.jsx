import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NoDataMessage from "../components/NoDataMessage";
import RequestCard from "../components/RequestCard";
import { fetchRequests } from "../store/actions/requestsAction";
import AnimationWrapper from "../components/AnimationWrapper";
import { AuthContext } from "../context/AuthContext";

const MyIssues = () => {
  const { auth } = useContext(AuthContext);
  const [filterClick, setFilterClick] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(""); // State to hold the selected category

  let categories = ["admin", "HR", "open", "in-progress", "resolved"];

  const dispatch = useDispatch();

  // Using useSelector to filter the requests based on selectedCategory
  const allRequests = useSelector((state) => {
    const requests = state.requestsReducer.requests;
    // If a category is selected, filter the requests by that category
    return selectedCategory
      ? requests.filter(
          (request) =>
            request.issueDetails.status === selectedCategory ||
            request.role.roleName === selectedCategory
        )
      : requests;
  });

  const handleClick = (category) => {
    setSelectedCategory(category); // Update the selected category
    setFilterClick(false); // Close the filter dropdown after selection
  };

  const handleClearFilters = () => {
    setSelectedCategory(""); // Reset the selected category to remove the filter
    setFilterClick(false); // Close the filter dropdown if open
  };

  const handleOutsideClick = (e) => {
    if (!e.target.closest(".filter-container")) {
      setFilterClick(false);
    }
  };

  useEffect(() => {
    if (auth.user.role == "admin") {
      dispatch(fetchRequests());
    }
    if (auth.user.role == "employee") {
      dispatch(fetchRequests(null, null, auth.user._id));
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [dispatch]);

  return (
    <AnimationWrapper>
      <div className="w-full min-h-[500px] my-24 overflow-auto flex justify-center p-5">
        <div className="w-full max-w-[900px] flex flex-col gap-5 items-start">
          <h1 className="text-4xl md:text-5xl w-full font-bold text-center text-nowrap">
            {auth.user.role === "admin" && "All Tickets"}
            {auth.user.role === "employee" && "My Tickets"}
          </h1>
          <div className="w-full flex justify-between items-center mt-2 md:mt-10">
            <span className="text-xl text-zinc-500 font-semibold">
              Filter By :-
            </span>
            <div className="flex gap-5 items-center">
              {/* Conditionally render Clear Filters button */}
              {selectedCategory && (
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-blue-500 underline"
                >
                  Clear Filters
                </button>
              )}
              {/* Filter Icon placed before the dropdown */}
              <div className="relative filter-container">
                <button onClick={() => setFilterClick(!filterClick)}>
                  <i
                    className={`text-2xl text-blue-500 fi fi-br-settings-sliders`}
                  ></i>
                </button>

                {filterClick && (
                  <div
                    className={`flex flex-col gap-10 absolute right-0 bg-white`}
                  >
                    <div className="w-64 border-[1px] border-zinc-200 p-5 rounded-md flex gap-2 flex-wrap">
                      {categories.map((category, index) => (
                        <button
                          key={index}
                          className={`border-[1px] px-4 py-2 rounded-full ${
                            selectedCategory === category
                              ? "bg-black text-white border-black"
                              : "border-zinc-400 text-zinc-400"
                          }`}
                          onClick={() => handleClick(category)}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            {allRequests.length ? (
              allRequests.map((request, index) => (
                <AnimationWrapper
                  key={index}
                  transition={{ duration: 1, delay: index * 0.2 }}
                >
                  <RequestCard data={request} />
                </AnimationWrapper>
              ))
            ) : (
              <NoDataMessage message="No Request made" />
            )}
          </div>
        </div>
      </div>
    </AnimationWrapper>
  );
};

export default MyIssues;
