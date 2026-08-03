const express=require("express");
const router=express.Router({mergeParams:true});
const {listingSchema,reviewSchema}=require("../schema.js");
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../MODELS/listing.js");
const Reviews = require("../MODELS/reviews.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn,validateReviews,isAuthor}=require("../middleware.js");

const reviewsController=require("../controllers/reviews.js");
//POST ROUTE FOR REVIEWS
router.post("/" ,isLoggedIn,validateReviews, wrapAsync(reviewsController.postreview));
//DELETE ROUTE FOR REVIEWS
router.delete("/:reviewid",isLoggedIn,isAuthor,(wrapAsync(reviewsController.deletereview)))

module.exports=router;