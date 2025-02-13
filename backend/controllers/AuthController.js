import userModel from "../models/user-model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
import { nanoid } from "nanoid";
import { emailRegex, nameRegex, passwordRegex } from "../utils/validation.js";

// data to send to frontend
const datatoSend = (user) => {
  return {
    _id: user._id,
    role: user.role,
    username: user.personalInfo.username,
    fullname: user.personalInfo.fullname,
    profile_img: user.personalInfo.profile_img
  };
};

//function to make generate unique Username
const generateUsername = async (email) => {
  let username = email.split("@")[0];
  let isUsernameExists = await userModel.exists({
    "personalInfo.username": username,
  });
  if (isUsernameExists) {
    username += nanoid().substring(0, 5);
  }
  return username;
};

//sign-up function
export const registerUser = async (req, res) => {
  try {
    const { fullname, password, email, role, employeeId, quarterNumber, phone, street, city, state, zip, completeAddress } = req.body;
    console.log(email);
    // Checking if user account is already created
    let user = await userModel.findOne({
      "personalInfo.email": email,
    });
    if (user) return res.status(409).send("Email already exists.");
    let userId = await userModel.findOne({
      "employeeId": employeeId,
    });
    if (userId) return res.status(409).send("Employee Id already exists.");

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        let username = await generateUsername(email);
        let newUser = await userModel.create({
          personalInfo: { fullname, email, password: hash, username, phone },
          address: { street, city, state, zip,quarterNumber, completeAddress }, role, employeeId });

        let token = generateToken(newUser);
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        res.status(200).json({ token, user: datatoSend(newUser) });
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//login function
export const loginUser = async (req, res) => {
  let { email, password } = req.body;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error: "Password must be 7-20 chars, with upper, lower, digit, and special char",
    });
  }

  let user = await userModel.findOne({ "personalInfo.email": email });
  if (!user) {
    return res.status(401).send("you don't have an account");
  }
  bcrypt.compare(password, user.personalInfo.password, (err, result) => {
    if (result) {
      let token = generateToken(user);
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });
      res.json({ token, user: datatoSend(user) });
    } else {
      return res.status(401).send("Incorrect email or password");
    }
  });
};

//logout function
export const logOutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logout successful" });
};
