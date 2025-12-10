
const Review = require("../models/review");
const Food = require("../models/Food");


module.exports.addReview = async (req, res) => {
  try {
    const { foodId } = req.params;
    const { comment, author } = req.body; // author comes from frontend

    if (!comment || !author) {
      return res.status(400).json({ message: "Comment and author are required" });
    }

    // Create new review
    const newReview = await Review.create({
      comment,
      author
    });

    // Add review ID to food
    const food = await Food.findById(foodId);
    food.review.push(newReview._id);
    await food.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review: newReview
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


// ---------------------- DELETE REVIEW ---------------------- //
module.exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    console.log("Deleting review with ID:", reviewId);

    // Remove review from Food items
    await Food.updateMany(
      { review: reviewId },
      { $pull: { review: reviewId } }
    );

    // Delete review
    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully"
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};