const express=require("express");
const router=express.Router({mergeParams:true});
const {listingSchema,reviewSchema}=require("../schema.js");
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../MODELS/listing.js");
const Reviews = require("../MODELS/reviews.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn,validateReviews,isAuthor}=require("../middleware.js");


//POST ROUTE FOR REVIEWS
router.post("/" ,isLoggedIn,validateReviews, wrapAsync(async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    const newreview=new Reviews(req.body.reviews);
    newreview.author=req.user._id;
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    req.flash("success","New review created!");
    res.redirect(`/listing/${listing._id}`);
}));
//DELETE ROUTE FOR REVIEWS
router.delete("/:reviewid",isLoggedIn,isAuthor,(wrapAsync(async(req,res)=>{
     let {id,reviewid}=req.params;
     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
     await Reviews.findByIdAndDelete(reviewid);
     req.flash("success","Review deleted successfully!")
     res.redirect(`/listing/${id}`)
})))

module.exports=router;