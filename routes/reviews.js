const express=require("express");
const router=express.Router({mergeParams:true});
const {listingSchema,reviewSchema}=require("../schema.js");
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../MODELS/listing.js");
const Reviews=require("../MODELS/reviews.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn } = require("../middlewares.js");

const validateReviews=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errormsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errormsg);
    }else
    next();
}

//POST ROUTE FOR REVIEWS
router.post("/" ,isLoggedIn,validateReviews, wrapAsync(async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    if(!listing){
        req.flash("error","Listing you requested does not exist!");
        return res.redirect("/listing");
    }

    const newreview=new Reviews(req.body.reviews);
    newreview.author = req.user._id
    await newreview.save();

    const updatedListing = await Listing.findByIdAndUpdate(
        listing._id,
        { $push: { reviews: newreview._id } },
        { runValidators: true }
    );

    if(!updatedListing){
        await Reviews.findByIdAndDelete(newreview._id);
        throw new ExpressError(500,"Could not save the review to this listing.");
    }

    req.flash("success","New review created!");
    res.redirect(`/listing/${listing._id}`);
}));
//DELETE ROUTE FOR REVIEWS
router.delete(
    "/:reviewid",
    isLoggedIn,
    wrapAsync(async (req, res) => {

        const { id, reviewid } = req.params;

        const review = await Reviews.findById(reviewid);

        if (!review) {
            req.flash("error", "Review not found!");
            return res.redirect(`/listing/${id}`);
        }

        // Check whether the logged-in user owns this review
        if (!review.author.equals(req.user._id)) {
            req.flash("error", "You are not authorized to delete this review!");
            return res.redirect(`/listing/${id}`);
        }

        await Listing.findByIdAndUpdate(
            id,
            { $pull: { reviews: reviewid } }
        );

        await Reviews.findByIdAndDelete(reviewid);

        req.flash("success", "Review deleted successfully!");

        res.redirect(`/listing/${id}`);
    })
);

module.exports=router;