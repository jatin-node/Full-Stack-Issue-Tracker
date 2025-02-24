import userModel from "../models/user-model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
import { nanoid } from "nanoid";
import { emailRegex, passwordRegex } from "../utils/validation.js";

// Data to send to frontend
const datatoSend = (user) => ({
  _id: user._id,
  role: user.role,
  username: user.personalInfo.username,
  fullname: user.personalInfo.fullname,
  profile_img: user.personalInfo.profile_img,
});

// Function to generate a unique username
const generateUsername = async (email) => {
  let username = email.split("@")[0];

  while (await userModel.exists({ "personalInfo.username": username })) {
    username = email.split("@")[0] + nanoid(5);
  }

  return username;
};

// Register User
export const registerUser = async (req, res) => {
  try {
    const { fullname, password, email, role, employeeId, quarterNumber, phone, street, city, state, zip, completeAddress } = req.body;
        
    let user = await userModel.findOne({ "personalInfo.email": email });
    if (user) return res.status(409).json({ error: "Email already exists." });

    let userId = await userModel.findOne({ employeeId });
    if (userId) return res.status(409).json({ error: "Employee ID already exists." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let username = await generateUsername(email);
    
    let newUser = await userModel.create({
      personalInfo: { fullname, email, password: hashedPassword, username, phone },
      address: { street, city, state, zip, quarterNumber, completeAddress },
      role,
      employeeId
    });

    let token = generateToken(newUser);
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({ token, user: datatoSend(newUser) });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ error: "Weak password" });
    }

    let user = await userModel.findOne({ "personalInfo.email": email });
    if (!user) return res.status(401).json({ error: "You don't have an account" });

    const isMatch = await bcrypt.compare(password, user.personalInfo.password);
    
    if (!isMatch) return res.status(401).json({ error: "Incorrect email or password" });

    let token = generateToken(user);
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.json({ token, user: datatoSend(user) });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Logout User
export const logOutUser = (req, res) => {
  res.cookie("token", "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", expires: new Date(0) });
  res.status(200).json({ message: "Logout successful" });
};
