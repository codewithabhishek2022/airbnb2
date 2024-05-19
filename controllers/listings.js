const Listing = require("../models/listing.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/Expresserror.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//Index route

module.exports.index = async (req, res) => {
  console.dir(req.cookies);
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

//new route
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
}

//show route

module.exports.showListing =async (req, res) => {
    let { id } = req.params;
    // console.log(id);
   
    let listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
  
        if(!listing){
        req.flash("error","Listing doesn't exist")
        res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs", { listing });
}

module.exports.createListing=async (req, res, next) => {
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid data for listing");
    // }
   let response= await geocodingClient.forwardGeocode({
        query: `${req.body.listing.location},${req.body.listing.country}`,
        limit: 1
      })
      .send()
    //   console.log(response.body)
// let coordinates =response.body.features[0].geometry.coordinates;
// console.log(coordinates);
    // return res.send(response.body.features[0].geometry);

    let url =req.file.path;
    let filename=req.file.filename;
let listing = req.body.listing;
console.log(listing);
const newListing = new Listing(listing);
newListing.image={url,filename}
newListing.owner = req.user._id;
newListing.geometry = response.body.features[0].geometry;
// if(!listing.titile)
//     { throw new ExpressError(400,"title is missing!");}
// if(!listing.description)
// { throw new ExpressError(400,"description is missing!");}
// if(!listing.price){
//     throw new ExpressError(400,"price is missing!");
// } 
// if(!listing.country){
    
//     throw new ExpressError(400,"country is missing!");
// }
// if(!listing.location){
//     throw new ExpressError(400,"Location is missing!");
// }


//Writing so many if's is a tedious task . So we will use joy to validate our schema.
//Install it using npm i joi

//Using Joi to check all the if conditions in a single way
let result =listingSchema.validate(req.body);

console.log(result);
if(result.error){
throw new ExpressError(400,result.error)
}
let savaedListing=await newListing.save();
console.log(savaedListing);
req.flash("success","New listing Created");

res.redirect("/listings");


}



module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested to edit doesn't exist")
        res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250")
    res.render("listings/edit.ejs", { listing,originalImageUrl });
}

module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
    }
    
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !=="undefined"){
    let url =req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();}
    req.flash("success","Listing Updated");
    return res.redirect(`/listings/${id}`);

}
module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted");
    res.redirect("/listings")
}
module.exports.search = async(req,res)=>{
 console.log(req.query);
 let title =req.query.title;
 if(!title){
    req.flash("error","Please enter something to search");
    return res.redirect("/listings");
 }
 if(title.trim()===""){
    req.flash("error","Please enter a valid search term");
    return res.redirect("/listings");
 }
 let allListings= await Listing.find({
    title: { $regex: title, $options: 'i' } // case-insensitive search
  });
  if(allListings.length===0){
    req.flash("error","No listings found");
    return res.redirect("/listings");
  }
  console.log("request received");
  res.render("listings/index.ejs", { allListings });

}