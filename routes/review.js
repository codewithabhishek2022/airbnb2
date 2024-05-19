const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync =require('../utils/wrapAsync.js');
const ExpressError = require('../utils/Expresserror.js');
const Review =require("../models/review.js");
const {listingSchema,reviewSchema}= require('../schema.js');
const Listing = require("../models/listing.js");
const {isLoggedIn,isReviewAuthor}=require("../middleware.js")

const reviewController =require("../controllers/review.js")

const validateReview =(req,res,next)=>{
    let {error} =reviewSchema.validate(req.body);
    if(error){
        let msg=error.details.map(el=>el.message).join(",");
        throw new ExpressError(400,msg);
    }
    else{
        next();
    }

}
//reviews route
//Another way to validate is by cretaing a middleware 
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//Delet Route for reveiw
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports =router;
