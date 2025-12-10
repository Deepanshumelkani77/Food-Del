

const express = require('express');
const router = express.Router();
const { addReview,deleteReview} = require('../controller/ReviewController');



// ADD REVIEW
router.post("/:foodId", addReview);

// DELETE REVIEW
router.delete("/:reviewId", deleteReview);


module.exports = router;