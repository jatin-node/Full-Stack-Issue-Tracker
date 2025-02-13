import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  roleName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    enum: ['admin', 'HR'],
  },
});

export default mongoose.model('Role', roleSchema);