const express=require("express");
const router=express.Router({mergeParams:true});
const {listingSchema,reviewSchema}=require("../../schema.js");
const wrapAsync=require("../../utils/wrapAsync.js");
const Listing=require("../../MODELS/listing.js");


const validateReviews=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errormsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errormsg);
    }else
    next();
}

//POST ROUTE FOR REVIEWS
router.post("/" ,validateReviews, wrapAsync(async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    const newreview=new Reviews(req.body.reviews);
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    res.flash("success","New review created!");
    res.redirect(`/listing/${listing._id}`);
}));
//DELETE ROUTE FOR REVIEWS
router.delete("/:reviewid",(wrapAsync(async(req,res)=>{
     let {id,reviewid}=req.params;
     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
     await Reviews.findByIdAndDelete(reviewid);
     res.flash("success","Review deleted successfully!")
     res.redirect(`/listing/${id}`)
})))

module.exports=router;