import axios from "axios";

export const signOut = async (setAuth, navigate) => {
  try {
    const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/logout", {
      withCredentials: true,
    });
    setAuth({ token: null });
    delete axios.defaults.headers.common["Authorization"]; // Clear the Authorization header
    navigate("/"); // Navigate to the root route
  } catch (error) {
    console.error("Error during sign out:", error);
  }
};
