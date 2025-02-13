import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../store/actions/requestsAction"; // Replace with your actual action
import { useNavigate } from "react-router-dom";
import AnimationWrapper from "../components/AnimationWrapper";

const UserManagementPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  const allUsers = useSelector((state) => state.requestsReducer.users); // Assuming all users are here
  console.log(allUsers);
  // Filter users based on search term
  const filteredUsers = allUsers?.filter(
    (user) =>
      user.personalInfo.fullname
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.personalInfo.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle row click to navigate to user details page
  const handleRowClick = (userId, username) => {
    navigate(`/user/${userId}/${username}/details`); // Navigate to user detail page
  };

  // Fetch users on component mount
  useEffect(() => {
    dispatch(fetchUsers()); // Fetch users when component mounts
  }, [dispatch]);

  return allUsers ? (
    <AnimationWrapper>
      <div className="max-w-7xl mx-auto p-6 my-24">
        <h1 className="text-3xl font-semibold mb-6">User Management</h1>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search users by name or email"
            className="w-full p-2 border rounded-lg shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* User Table */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Employee Id</th>
                <th className="px-4 py-2 text-left">Phone</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers?.map((user) => (
                <tr
                  key={user._id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    handleRowClick(user._id, user.personalInfo.username)
                  } // Handle row click for navigation
                >
                  <td className="px-4 py-2">{user.personalInfo.fullname}</td>
                  <td className="px-4 py-2">{user.personalInfo.email}</td>
                  <td className="px-4 py-2">{user.role}</td>
                  <td className="px-4 py-2">{user.employeeId}</td>
                  <td className="px-4 py-2">{user.personalInfo.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AnimationWrapper>
  ) : (
    <div>Loading...</div>
  );
};

export default UserManagementPage;
