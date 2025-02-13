import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "./cloudinary.js";
import roleModel from "../models/role-model.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    try {
      let folderName = "support_app/profile_photos"; // Default folder for all profiles

      // Ensure req.body.role exists before querying
      if (req.body.role) {
        const role = await roleModel.findById(req.body.role).select("roleName -_id");

        if (role) {
          if (role.roleName === "admin") {
            folderName = "support_app/admin_photos"; // Separate folder for admins
          } else if (role.roleName === "HR") {
            folderName = "support_app/hr_photos"; // Separate folder for HR
          }
          // All other roles (employees) remain in "profile_photos"
        }
      }

      return {
        folder: folderName,
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
        transformation: [{ width: 800, height: 600, crop: "fit" }], // Preserve aspect ratio
      };
    } catch (error) {
      console.error("Error setting Cloudinary folder:", error);
      throw new Error("Error processing file upload.");
    }
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPG, PNG, and WEBP formats are allowed!"), false);
    }
    cb(null, true);
  },
});

export default upload;