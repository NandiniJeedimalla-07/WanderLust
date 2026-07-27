const express=require("express");
const router=express.Router();
const wrapAsync=require("../../utils/wrapAsync.js");
const {listingSchema,reviewSchema}=require("../../schema.js");
const ExpressError=require("../../utils/ExpressError.js");
const Listing=require("../../MODELS/listing.js");



const validateListing=(req,res,next)=>{
    
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errormsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errormsg);
    }else
    next();

}


//INDEX ROUTE
router.get("/",wrapAsync(async (req,res)=>{
    let allListing=await Listing.find({});
    console.log(allListing);
    res.render("./listings/index.ejs",{allListing});
}));
//NEW ROUTE
router.get("/new",(req,res)=>{
    res.render("./listings/newform.ejs");
})

//SHOW ROUTE
router.get("/:id" , wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const data= await Listing.findById(id).populate("reviews");
    // console.log(data);
    if(!data){
        req.flash("error","Listing you requested do not exist!")
        res.redirect("/listing")
    }
    else
    res.render("./listings/show.ejs",{data});
}));

//CREATE ROUTE
router.post("/",validateListing,wrapAsync(async (req,res)=>{
    // if(!req.body.Listing){
    //     throw new ExpressError(400,"send valid data for listing");
    // }
     let result=listingSchema.validate(req.body);
     if(result.error){
        throw new ExpressError(400,result.error);
     }
         let lis=new Listing(req.body.Listing);
         await lis.save()
         req.flash("success","New Listing created !")
        res.redirect("/listing")  
}));
//EDIT ROUTE(form)
router.get("/:id/edit",wrapAsync( async (req, res) => {
    let {id}=req.params;
        const data= await Listing.findById(id);
    if(!data){
        req.flash("error","Listing you request donot exist!")
        res.redirect("/listing");
     }
     else{
    res.render("./listings/edit.ejs",{data});
     }

}));

//UPDATE ROUTE
router.put("/:id",validateListing,wrapAsync(async(req,res)=>{
     let {id}=req.params;
     const data= await Listing.findByIdAndUpdate(id, {...req.body.Listing});
      req.flash("success","Updated Successfully !")
      res.redirect(`/listing/${id}`);
    
}));
//DELETE ROUTE
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted successfully!")
    res.redirect("/listing");
}));

module.exports=router;