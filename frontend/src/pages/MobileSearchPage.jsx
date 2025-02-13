import React, { useState } from "react";
import NoDataMessage from "../components/NoDataMessage";
import axios from "axios";
import AnimationWrapper from "../components/AnimationWrapper";
import RequestCard from "../components/RequestCard";

const MobileSearchPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(""); // For error handling

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // Fetch data from backend
  const fetchData = async (searchTerm) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + `/search/requests?term=${searchTerm}`
      );
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
      <div className="w-full mt-10 mb-24 px-5 flex flex-col gap-10">
        <div className="w-full relative">
          <i className="absolute block top-[9px] left-5  text-xl fi fi-rr-search"></i>
          <input
            className="w-full py-2 border-[1px] px-12 rounded-full border-zinc-400"
            type="text"
            placeholder="Write here..."
            onChange={handleSearchChange}
          />
        </div>
        <div className="">
          {loading && (
            <div className="absolute top-[50px] right-12 text-gray-500">
              Loading...
            </div>
          )}
          {/* Show search results */}
          <div className="flex flex-col gap-5">
            {requests.length ? (
              requests.map((request, index) => (
                <AnimationWrapper
                  key={index}
                  transition={{ duration: 1, delay: index * 0.1 }}
                >
                  <RequestCard data={request} />
                </AnimationWrapper>
              ))
            ) : (
              <NoDataMessage message="No search Results" />
            )}
          </div>
        </div>
      </div>
    </AnimationWrapper>
  );
};

export default MobileSearchPage;
