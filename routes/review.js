const express = require("express");
const router = express.Router({mergeParams: true});

const Listing = require("../modeles/listings.js");
const wrapAsync    = require("../utils/wrapAsync.js");  
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const Review = require("../modeles/review.js");
const {validateReview ,isLoggedIn,isReviewAuthor} = require("../middelware.js");
const reviewController = require("../controllers/reviews.js");

// Reviws
//post review rout
router.post("/",isLoggedIn, validateReview ,wrapAsync(reviewController.creatReview));
// Delete  Review rout
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;