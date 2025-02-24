import React, { useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRequests } from "../store/actions/requestsAction";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { slugify } from "../utils/slugify";

const AdminPage = () => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const dispatch = useDispatch();

  // Get all requests from the Redux store
  const allRequests = useSelector((state) => state.requestsReducer.requests);

  // Filter requests by status
  const filterRequestsByStatus = (requests, status) => {
    return requests.filter((request) => request.issueDetails.status === status);
  };

  const allPendingRequests = filterRequestsByStatus(allRequests, "open");
  const allInProgressRequests = filterRequestsByStatus(allRequests, "in-progress");
  const allResolvedRequests = filterRequestsByStatus(allRequests, "resolved");

  const openRequest = (ticket, title) => {
    navigate(`/request/${auth.user._id}/${slugify(title)}/ticket/${ticket}`);
  };

  useEffect(() => {
    dispatch(fetchRequests(auth.token, null, null, null));
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto p-6 my-24">
      <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>

      {/* Section for each status */}
      {[
        { title: "Pending Requests", data: allPendingRequests, color: "text-blue-500" },
        { title: "In Progress Requests", data: allInProgressRequests, color: "text-yellow-500" },
        { title: "Resolved Requests", data: allResolvedRequests, color: "text-green-500" },
      ].map((section, index) => (
        <section className="mb-6" key={index}>
          <h2 className="text-xl font-semibold text-gray-700">{section.title}</h2>
          {section.data.length === 0 ? (
            <p className="text-gray-500">No requests found in this category.</p>
          ) : (
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-100 text-gray-600">
                    <th className="px-4 py-2 text-left w-2/5">Title</th>
                    <th className="px-4 py-2 text-left w-1/5">Status</th>
                    <th className="px-4 py-2 text-left w-1/5">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {section.data.map((request) => (
                    <tr
                      key={request._id}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => openRequest(request.issueTicket, request.issueDetails.issueTitle)}
                    >
                      <td className="px-4 py-2 truncate max-w-xs">
                        {request.issueDetails.issueTitle}
                      </td>
                      <td className={`px-4 py-2 ${section.color}`}>
                        {request.issueDetails.status}
                      </td>
                      <td className="px-4 py-2">
                        <button className={`${section.color} hover:underline`}>
                          {section.title === "Resolved Requests"
                            ? "View Details"
                            : section.title === "In Progress Requests"
                            ? "Update"
                            : "Resolve"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ))}
    </div>
  );
};

export default AdminPage;
