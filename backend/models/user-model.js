import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    personalInfo: {
      fullname: {
        type: String,
        lowercase: true,
        required: true,
        minlength: [3, "Fullname must be 3 letters long"],
        trim: true,
      },
      username: {
        type: String,
        lowercase: true,
        minlength: [3, "Username must be 3 letters long"],
        unique: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
      },
      password: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        trim: true,
      },
      profile_img: {
        type: String,
        default: "https://res.cloudinary.com/dgg2yvkxh/image/upload/v1739303110/default_profile_veljbr.png",
        trim: true,
      }
    },
    address: {
      street: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      zip: {
        type: String,
        trim: true,
      },
      quarterNumber: {
        type: String,
        required: true,
        trim: true,
      },
      completeAddress: {
        type: String,
        trim: true,
      },
    },
    role: {
      type: String,
      enum: ["employee", "admin"],
      required: true,
      default: "employee",
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
