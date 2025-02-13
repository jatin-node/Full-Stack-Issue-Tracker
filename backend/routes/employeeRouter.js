import express from "express";
import categoryModel from "../models/category-model.js";
import { isloggedin } from "../middleware/isloggedin.js";
import userModel from "../models/user-model.js";
import subcategoryModel from "../models/subcategory-model.js";
import issueModel from "../models/issue-model.js"; // Import the issue model
import upload from "../config/multer.js"; // Added import for multer configuration
import roleModel from "../models/role-model.js";

const router = express.Router();

router.post("/role", async (req, res) => {
  const role = await roleModel.find();
  // const categories = await categoryModel.find({roleId: role._id}).select("categoryName");

  res.json({ role });
});
router.post("/category", async (req, res) => {
  const { roleId } = req.body;
  if (!roleId) {
    return res.status(400).send("Role ID is required");
  }
  try {
    const categories = await categoryModel
      .find({ roleId })
      .select("categoryName");
    res.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).send("Server error");
  }
});

router.post("/subcategory", isloggedin, async (req, res) => {
  const { categoryId } = req.body;
  if (!categoryId) {
    return res.status(400).send("Category ID is required");
  }
  try {
    const subCategories = await subcategoryModel
      .find({
        category: categoryId,
      })
      .select("subcategoryName");
    res.json({ subCategories });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// router.post("/upload-multiple-images", isloggedin, upload.array("images", 5), async (req, res) => {
//   try {
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ message: "No images uploaded" });
//     }
//     const imageUrls = req.files.map(file => file.path); // Cloudinary stores URL in 'path'

//     return res.status(200).json({
//       message: "Images uploaded successfully!",
//       imageUrls,
//     });
//   } catch (error) {
//     console.error("Upload error:", error);
//     return res.status(500).json({ message: "Upload failed", error });
//   }
// });

router.post(
  "/submit",
  isloggedin,
  upload.array("images", 5),
  async (req, res) => {
    try {
      const {
        issueTicket,
        reportedBy,
        email,
        issueTitle,
        issueDescription,
        role,
        category,
        subcategory,
      } = req.body;
      // Check if the number of images exceeds the allowed limit
      if (req.files.length > 5) {
        return res.status(400).json({ message: "Maximum 5 images allowed." });
      }
      const imageUrls = req.files.map((file) => file.path);
      console.log(imageUrls);


      const newIssue = new issueModel({
        issueDetails: {
          issueTitle,
          issueDescription,
          images: imageUrls,
        },
        email,
        issueTicket,
        role,
        category,
        subcategory,
        reportedBy,
      });

      await newIssue.save();
      res
        .status(201)
        .json({ message: "Issue submitted successfully!", issue: newIssue });
    } catch (error) {
      console.error("Issue submission error:", error);
      res.status(500).json({ message: "Issue submission failed", error });
    }
  }
);

export default router;
