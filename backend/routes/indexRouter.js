import express from "express";
import bcrypt from "bcrypt";
import { registerUser, loginUser, logOutUser } from "../controllers/AuthController.js";
import { isloggedin } from "../middleware/isloggedin.js";
import issueModel from "../models/issue-model.js";
import roleModel from "../models/role-model.js"; // Import the role model
import userModel from "../models/user-model.js";
import upload from "../config/multer.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to the Issue Tracker API");
});

router.post("/sign-in", registerUser);
router.post("/log-in", loginUser);
router.post("/logout", isloggedin, logOutUser);

router.post("/update/profile/image", upload.single("image"), isloggedin, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }
    const image = req.file.path; // Cloudinary URL

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      { $set: { "personalInfo.profile_img": image } },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile image updated successfully",
      imageUrl: image, // Returning image URL
    });
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/get/users", isloggedin, async function (req, res) {
  const { role, status , _id } = req.body; // Filtering by role and status (if provided)
  try {
    const query = {};
    if (role) {
      query["role"] = role;
    }
    if (status) {
      query["status"] = status;
    }
    if (_id) query["_id"] = _id;

    const users = await userModel.find(query).select("-password"); // Exclude password from the response
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/get/requests",isloggedin,  async function (req, res) {
  const { status, role, _id } = req.body;
  try {
    const query = {};
    if (role) {
      const roleDoc = await roleModel.findOne({ roleName: role });
      if (roleDoc) {
        query["role"] = roleDoc._id;
      } else {
        return res.status(404).json({ message: "Role not found" });
      }
    }
    if (status) query["issueDetails.status"] = status;
    if (_id) query["reportedBy"] = _id;

    const requests = await issueModel
      .find(query)
      .populate("role", "roleName -_id")
      .populate("category", "categoryName roleId -_id")
      .populate("subcategory", "subcategoryName category -_id")
      .populate(
        "reportedBy",
        "personalInfo.fullname personalInfo.username personalInfo.email personalInfo.phone address.street address.city address.state address.zip address.quarterNumber address.completeAddress employeeId"
      ).sort({createdAt: -1});
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/get/user/details", isloggedin, async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not logged in" });
    }

    const { username } = req.body;

    const details = await userModel.findOne({
      "personalInfo.username": username,
    });
    if (!details) return res.status(404).json({ message: "User not found" });
    res.status(200).json(details);
  } catch (error) {
    console.error("Error fetching details:", error);
    res.status(500).json({ message: error.message });
  }
});
router.post("/update/user/details", isloggedin, async (req, res) => {
  try {
    const { employeeId, personalInfo = {}, address = {} } = req.body;
    const { username, email, phone } = personalInfo;
    const { street, zip, city, state, quarterNumber, completeAddress } =
      address;
    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not logged in" });
    }
    const userUpdatedDetails = await userModel.findOneAndUpdate(
      { _id: req.body._id },
      {
        $set: {
          employeeId,
          "personalInfo.username": username,
          "personalInfo.email": email,
          "personalInfo.phone": phone,
          "address.street": street,
          "address.zip": zip,
          "address.city": city,
          "address.state": state,
          "address.quarterNumber": quarterNumber,
          "address.completeAddress": completeAddress,
        },
      },
      { new: true } // Return updated document
    );
    if (!userUpdatedDetails) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(userUpdatedDetails);
  } catch (error) {
    console.error("Error updating details:", error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/update/password", isloggedin, async (req, res) => {
  const { username, password } = req.body;
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: User not logged in" });
  }
  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await userModel.findOneAndUpdate(
      { "personalInfo.username": username },{
        $set: { "personalInfo.password": hashedPassword },
      },
      { new: true } // Return the updated document
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating password" });
  }
});

router.post("/get/user/issue", isloggedin, async (req, res) => {
  try {
    const { issueTicket } = req.body;
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not logged in" });
    }

    const userIssues = await issueModel.find({ issueTicket }).populate("assignedTo", "personalInfo.username").populate("reportedBy", "personalInfo.username ");

    res.status(200).json(userIssues);
  } catch (error) {
    console.error("Error fetching user issues:", error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/search/requests", async (req, res) => {
  const { term } = req.query; // Get the search term from the query params

  try {
    const query = {
      $or: [
        { "issueDetails.issueTitle": { $regex: term, $options: "i" } }, //  title match
        { "issueDetails.issueDescription": { $regex: term, $options: "i" } } //  description match
      ]
    };

    const results = await issueModel
      .find(query)
      .populate("role", "roleName -_id")
      .populate("category", "categoryName roleId -_id")
      .populate("subcategory", "subcategoryName category -_id")
      .populate("reportedBy", "personalInfo.fullname personalInfo.email personalInfo.username");

    res.status(200).json(results);
  } catch (error) {
    console.error("Error searching requests:", error);
    res.status(500).json({ message: "An error occurred while searching requests" });
  }
});


export default router;
