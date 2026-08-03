const Listing=require("../MODELS/listing.js")
const Reviews=require("../MODELS/reviews.js")

module.exports.postreview=async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    const newreview=new Reviews(req.body.reviews);
    newreview.author=req.user._id;
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    req.flash("success","New review created!");
    res.redirect(`/listing/${listing._id}`);
}

module.exports.deletereview=async(req,res)=>{
     let {id,reviewid}=req.params;
     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
     await Reviews.findByIdAndDelete(reviewid);
     req.flash("success","Review deleted successfully!")
     res.redirect(`/listing/${id}`)
}