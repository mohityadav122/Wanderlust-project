const Listing = require("../modeles/listings.js");
const Review = require("../modeles/review.js");

module.exports.creatReview = async (req,res) =>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Review created !");
    res.redirect(`/listings/${listing._id}`);
};
module.exports.destroyReview = async(req,res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
    await Review.findById(reviewId);
    req.flash("success","Deeted Review!");
    res.redirect(`/listings/${id}`);
    };