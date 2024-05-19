const Review =require("../models/review.js");
const {reviewSchema}= require('../schema.js');
const Listing = require("../models/listing.js");

module.exports.createReview=async(req,res)=>{
    let {id}=req.params;
    
    // let result =reviewSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    // throw new ExpressError(400,result.error)
    //  }

     let listing=await Listing.findById(id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review created");
    res.redirect(`/listings/${listing._id}`);
  
}

module.exports.destroyReview=async(req,res)=>{
    console.log(req.params);
     let {id,reviewId}= req.params;
     let listing=await Listing.findByIdAndUpdate(id,{ $pull:{reviews:reviewId}});
          await Review.findByIdAndDelete(reviewId);
        req.flash("success","Review Deleted");
          res.redirect(`/listings/${listing._id}`);
  
}