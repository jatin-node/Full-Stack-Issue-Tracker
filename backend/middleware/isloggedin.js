import jwt from "jsonwebtoken";
import userModel from "../models/user-model.js";

export const isloggedin = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await userModel.findOne({"personalInfo.email": decoded.email}).select("personalInfo role");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token." });
  }
};
