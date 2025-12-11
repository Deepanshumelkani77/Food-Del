const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema({
  comment: { type: String, required: true },
  created: { type: Date, default: Date.now },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

// IMPORTANT FIX 👇
// Prevent OverwriteModelError
module.exports = mongoose.models.Review || mongoose.model("Review", reviewSchema);
