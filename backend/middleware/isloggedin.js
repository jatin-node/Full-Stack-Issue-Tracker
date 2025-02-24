import jwt from "jsonwebtoken";
import userModel from "../models/user-model.js";

export const isloggedin = async (req, res, next) => {
  let token = null;

  // Check both cookie and Authorization header for token
  if (req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // If no token found, return 401 (Unauthorized)
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided" });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    // Find the user based on the decoded token's email
    const user = await userModel.findOne({ "personalInfo.email": decoded.email }).select("personalInfo role");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // Attach user data to request object
    next(); // Move to the next middleware

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ message: "Token expired. Please log in again." });
    }
    return res.status(403).json({ message: "Invalid token." });
  }
};
