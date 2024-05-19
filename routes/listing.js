const express = require("express");
const router = express.Router();
const wrapAsync =require('../utils/wrapAsync.js');
const {listingSchema,reviewSchema}= require('../schema.js');
const ExpressError = require('../utils/Expresserror.js');
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner}=require("../middleware.js");

const multer = require("multer");
const {storage}=require("../cloudConfig.js");
const upload =multer({storage});

const listingController =require("../controllers/listings.js")


router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'), wrapAsync(listingController.createListing));


//Index Route
// router.get("/", wrapAsync(listingController.index));

//Search Route
router.get("/search", wrapAsync(listingController.search));
//New ROute
router.get("/new",isLoggedIn, listingController.renderNewForm)

//Show route

// router.get("/:id", wrapAsync(listingController.showListing));

//Create route using try catch
// app.post("/listings", async (req, res, next) => {
// try{
//     let listing = req.body.listing;
//     console.log(listing);
//     const newListing = new Listing(listing);

//     await newListing.save();
//     res.redirect("/listings");
// }
// catch(err){
//     next(err);
// }

// });
// Updated create route using wrapAsync
// router.post("/",isLoggedIn, 
        //   wrapAsync(listingController.createListing));
//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));


router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner, upload.single('listing[image]'),wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));


// router.put("/:id",isLoggedIn,isOwner, wrapAsync(listingController.updateListing));
//Delete Route 
// router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));



module.exports =router;