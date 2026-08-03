const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../MODELS/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listing.js");

//NEW ROUTE
router.get("/new",isLoggedIn,listingController.newform)

//EDIT ROUTE(form)
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync( listingController.edit));


router
 .route("/")
 .get(wrapAsync(listingController.index))  //INDEX ROUTE
 .post(validateListing,wrapAsync(listingController.create));   //CREATE ROUTE


router
.route("/:id")
.get( wrapAsync(listingController.show))
.put(isLoggedIn,isOwner,validateListing,wrapAsync(listingController.update))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.delete));


module.exports=router;