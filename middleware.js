const Listing=require("./MODELS/listing.js");
const Review=require("./MODELS/reviews.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const ExpressError=require("./utils/ExpressError.js");

module.exports.isLoggedIn=(req,res,next)=>{
        if(!req.isAuthenticated()){
        req.flash("error","you must be logged in to create listing!")
        return  res.redirect("/login");
    }
    next();
}
module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing!");
        return res.redirect(`/listing/${id}`);
    }
    next();
}
 module.exports.validateListing=(req,res,next)=>{
    
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errormsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errormsg);
    }else
    next();

 }

  module.exports.validateReviews=(req,res,next)=>{
     let {error}=reviewSchema.validate(req.body);
     if(error){
         let errormsg=error.details.map((el)=>el.message).join(",");
         throw new ExpressError(400,errormsg);
     }else
     next();
 }

 module.exports.isAuthor=async(req,res,next)=>{
    let {id,reviewid}=req.params;
    let review =await Review.findById(reviewid);
    if(review.author&&!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review!");
        return res.redirect(`/listing/${id}`);
    }
    next();
}