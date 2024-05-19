const Listing= require("./models/listing.js");
const Review= require("./models/review.js");
const OTP = require("./models/otp.js");

module.exports.isLoggedIn = (req,res,next)=> { 
  if(!req.isAuthenticated()){   
    req.session.redirectUrl=req.originalUrl;
    req.flash("error","You must be logged in to proceed");
    return res.redirect("/login");
}
next();
}

module.exports.verifyOtp = async (req, res, next) => {
    const { otp1, otp2, otp3, otp4, otp5, otp6, email } = req.body;
    const otp = otp1 + otp2 + otp3 + otp4 + otp5 + otp6;

    try {
        const databaseOtp = await OTP.findOne({ email });

        if (!databaseOtp) {
            req.flash("error", "OTP not found.");
            return res.redirect("/signup");
        }

        if (otp === databaseOtp.otpCode && databaseOtp.expiresAt > new Date()) {
            // Proceed to the next middleware or route handler
            return next();
        } else {
            req.flash("error", "Invalid or expired OTP.");
            return res.redirect("/signup");
        }
    } catch (error) {
        console.error(error);
        req.flash("error", "An error occurred while verifying OTP.");
        return res.redirect("/signup");
    }
};


module.exports.saveRedirectUrl= (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl =req.session.redirectUrl
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let id = req.params.id;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currentUser._id))
       {
           req.flash("error","You are not the owner of this listing");
           return res.redirect(`/listings/${id}`);

       }
       next();
}

module.exports.isReviewAuthor =async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id))
       {
           req.flash("error","You are not the author of this review");
           return res.redirect(`/listings/${id}`);

       }
       next();

}