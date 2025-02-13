import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    issueDetails: {
      issueTitle: {
        type: String,
        required: true,
        trim: true,
      },
      issueDescription: {
        type: String,
        required: true,
        trim: true,
      },
      status: {
        type: String,
        default: "open",
        enum: ["open", "in-progress", "resolved"],
      },
      images: {
        type: [String],
        default: [],
      },
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    issueTicket: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    // ...existing code...
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Issue", issueSchema);
