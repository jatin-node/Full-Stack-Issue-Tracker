import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import GetDay from "../components/GetDay";
import LastUpdated from "../components/LastUpdated";
import ImageModal from "../components/ImageModal";
import AnimationWrapper from "../components/AnimationWrapper";
import NoDataMessage from "../components/NoDataMessage";
import { AuthContext } from "../context/AuthContext";
import { toast, Toaster } from "react-hot-toast";

const RequestOpenPage = () => {
  const { auth } = useContext(AuthContext);
  const { ticketId } = useParams();
  const [issueData, setIssueData] = useState({});
  const [isImageModalOpen, setIsImageModalOpen] = useState(false); 
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); 
  const [selectedImage, setSelectedImage] = useState(null);
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  // Handle image click to open modal
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };

  // Fetch users for assigning to issue
  const fetchUsers = async () => {
    try {
      const response = await axios.post(import.meta.env.VITE_BACKEND_URL + "/admin/get/users", {}, {
        withCredentials: true,
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  // Fetch issue data based on ticketId
  const fetchIssue = async () => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/get/user/issue",
        { issueTicket: ticketId },
        { withCredentials: true,
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json",
          },
         }
      );
      const singleissue = response.data[0];
      setIssueData(singleissue);
      setStatus(singleissue?.issueDetails?.status || "");
      // If the issue has an assigned user, fetch their username
      if (singleissue.assignedTo) {
        setAssignedTo(singleissue.assignedTo.personalInfo.username);
      }
    } catch (error) {
      console.error("Failed to fetch issue:", error);
    }
  };

  // Handle issue update (status and assigned user)
  const handleUpdate = async () => {
    try {
      if (!status || !assignedTo) {
        toast.error("Please select status and assign to a user.");
        return;
      }
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/admin/update/issue",
        {
          issueTicket: ticketId,
          status,
          assignedTo,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        setIssueData((prevState) => ({
          ...prevState,
          issueDetails: {
            ...prevState.issueDetails,
            status,
          },
          assignedTo,
        }));
        setIsUpdateModalOpen(false);
      } else {
        toast.error("Failed to update the issue.");
      }
    } catch (error) {
      console.error("Error updating issue", error);
      toast.error("There was an error updating the issue.");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchIssue();
  }, [ticketId]);

  return issueData ? (
    <AnimationWrapper>
      <div className="w-full flex flex-col justify-center items-center gap-5 my-24 p-5">
        <Toaster />
        <div className="w-full max-w-[900px] flex flex-col md:flex-row">
          <div className="md:w-[20%] p-5 flex md:flex-col flex-wrap justify-between gap-5 md:mt-10">
            <div>
              <h2 className="uppercase font-semibold text-sm text-zinc-600">Ticket id</h2>
              <span className="font-semibold text-sm md:text-md">#{issueData?.issueTicket}</span>
            </div>
            <div>
              <h2 className="uppercase font-semibold text-sm text-zinc-600">Created</h2>
              <span className="font-semibold text-sm md:text-md">{GetDay(issueData?.createdAt)}</span>
            </div>
            <div>
              <h2 className="uppercase text-nowrap font-semibold text-sm text-zinc-600">Last Activity</h2>
              <span className="font-semibold text-sm md:text-md"><LastUpdated dateString={issueData?.updatedAt} /></span>
            </div>
            <div>
              <h2 className="uppercase font-semibold text-sm text-zinc-600">Status</h2>
              <span className="font-semibold text-sm md:text-md">{issueData?.issueDetails?.status}</span>
            </div>
          </div>
          <div className="md:w-[80%] max-w-[600px] p-5 flex flex-col items-start gap-3">
            <Link to={`/user/${auth.user.username}/my-issues`} className="uppercase font-sans text-red-500">&lt; see all tickets</Link>
            <h2 className="text-xl font-bold">{issueData?.issueDetails?.issueTitle}</h2>
            <p className="text-sm leading-4">{issueData?.issueDetails?.issueDescription}</p>
            <hr className="w-full border-[1px] bg-zinc-400" />
            <div className="flex justify-start items-center w-full h-20 overflow-auto object-cover gap-5">
              {issueData?.issueDetails?.images.length ? (
                issueData?.issueDetails?.images.map((i, index) => {
                  return (
                    <img
                      key={index}
                      onClick={() => handleImageClick(i)}
                      className="w-20 h-20 object-cover rounded-md cursor-pointer"
                      src={i}
                      alt={`issue image ${i}`}
                    />
                  );
                })
              ) : (
                <NoDataMessage message="No Images" />
              )}
            </div>
            <ImageModal imageUrl={selectedImage} isOpen={isImageModalOpen} onClose={closeImageModal} />
            <hr className="w-full border-[1px] bg-zinc-400" />
            {auth.user.role === "admin" && (
              <div className="flex">
                <h2 className="uppercase font-semibold text-sm text-zinc-600">Assigned To: &nbsp;</h2>
                <span className="font-semibold text-sm md:text-md">{assignedTo || "Unassigned"}</span>
              </div>
            )}
            {issueData?.issueDetails?.status !== "resolved" && (
              <button onClick={() => setIsUpdateModalOpen(true)} className={`${auth.user.role === "admin" ? "block" : "hidden"} px-5 py-2 border-[1px] font-bold bg-blue-500 text-white hover:bg-blue-600`}>
                Resolve
              </button>
            )}
            {isUpdateModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white mx-5 p-6 rounded-lg w-[400px] relative">
                  <button onClick={closeUpdateModal} className="absolute top-2 right-2 text-2xl text-gray-600"><i className="fi fi-rr-cross-circle"></i></button>
                  <h2 className="text-lg font-semibold mb-4">Update Issue</h2>
                  <div className="mb-4">
                    <label className="block text-sm text-zinc-600">Status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-2 border rounded-md">
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm text-zinc-600">Assigned To</label>
                    <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="w-full p-2 border rounded-md">
                      <option value="">Unassigned</option>
                      {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.personalInfo.username}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button onClick={handleUpdate} className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Update</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AnimationWrapper>
  ) : (
    <div>Loading...</div>
  );
};

export default RequestOpenPage;
