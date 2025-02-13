import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema({
  subcategoryName: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
}, {
  timestamps: true
});

subcategorySchema.index({ category: 1, subcategoryName: 1 });

const Subcategory = mongoose.model('Subcategory', subcategorySchema);
Subcategory.createIndexes();

export default Subcategory;