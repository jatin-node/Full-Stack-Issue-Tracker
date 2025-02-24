import axios from "axios";
import { setRequests, setUsers } from "../reducers/RequestsReducer";

export const fetchRequests = (token, status, role, _id) => async (dispatch) => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_BACKEND_URL + "/get/requests",
      { status, role, _id },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    dispatch(setRequests(response.data));
  } catch (error) {
    console.error(
      `Error fetching ${status || "all"} requests for ${role || "all roles"}:`,
      error
    );
  }
};

export const fetchUsers = (token, status, role, _id) => async (dispatch) => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_BACKEND_URL + "/get/users",
      { status, role, _id },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    dispatch(setUsers(response.data));
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};
