import axios from "axios";
import { setRequests, setUsers } from "../reducers/RequestsReducer";

export const fetchRequests = (status, role, _id) => async (dispatch) => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_BACKEND_URL + "/get/requests",
      { status, role, _id },
      { withCredentials: true }
    );
    console.log("Response from backend:", response.data); // Log the response from the backend

    dispatch(setRequests(response.data));
  } catch (error) {
    console.error(
      `Error fetching ${status || "all"} requests for ${role || "all roles"}:`,
      error
    );
  }
};

export const fetchUsers = (status, role, _id) => async (dispatch) => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_BACKEND_URL + "/get/users",
      { status, role, _id },
      {
        withCredentials: true,
      }
    );
    console.log("Response from backend:", response.data); // Log the response from the backend
    dispatch(setUsers(response.data));
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};
