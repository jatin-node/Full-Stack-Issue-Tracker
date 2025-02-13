import express from "express";
import categoryModel from "../models/category-model.js";
import { isloggedin } from "../middleware/isloggedin.js";
import subcategoryModel from "../models/subcategory-model.js";
import roleModel from "../models/role-model.js";
import issueModel from "../models/issue-model.js";
import userModel from "../models/user-model.js";
const router = express.Router();

router.post("/create-category", isloggedin, async (req, res) => {
  const { role, categoryName, tags } = req.body;
  try {
    let rolefind = await roleModel.findOne({ roleName: role });
    if (!rolefind) {
      rolefind = await roleModel.create({
        roleName: role,
      });
    }
    const category = await categoryModel.create({
      categoryName,
      roleId: rolefind._id,
    });
    const subcategories = await Promise.all(
      tags.map((name) =>
        subcategoryModel.create({
          subcategoryName: name,
          category: category._id,
        })
      )
    );
    res.status(201).send({ category, subcategories });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/update/issue", async (req, res) => {
  const { issueTicket, status, assignedTo } = req.body;
  if (!issueTicket || !status) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }
  try {
    // Find the issue by ticket
    const issue = await issueModel.findOne({ issueTicket });
    if (!issue) {
      return res.status(404).json({ success: false, message: "Issue not found" });
    }

    issue.issueDetails.status = status;
    // Update assignedTo only if a valid ObjectId is provided
    if (assignedTo) {
      const user = await userModel.findById(assignedTo);
      if (!user) {
        return res.status(404).json({ success: false, message: "Assigned user not found" });
      }
      issue.assignedTo = assignedTo;
    } else {
      issue.assignedTo = null;
    }
    await issue.save();
    res.status(200).json({ success: true, message: "Issue updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/get/users", async (req, res) => {
  try {
    const users = await userModel.find({}, "personalInfo.username _id");
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
});

router.get("/get/user/:userId", async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userId, "personalInfo.username");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ username: user.personalInfo.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
});


export default router;
