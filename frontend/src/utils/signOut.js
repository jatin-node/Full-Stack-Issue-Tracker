import axios from "axios";

export const signOut = async (setAuth, navigate) => {
  try {
    await axios.post(import.meta.env.VITE_BACKEND_URL + "/logout", {}, {
      withCredentials: true, // Ensures cookies are sent
    });

    // Clear localStorage and auth state
    localStorage.removeItem("auth"); 
    delete axios.defaults.headers.common["Authorization"];
    setAuth({ token: null });

    navigate("/"); // Redirect to home page
  } catch (error) {
    console.error("Error during sign out:", error);
  }
};
