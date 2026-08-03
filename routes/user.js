const express=require("express");
const router=express.Router();
const User=require("../MODELS/user.js");
const wrapAsync=require("../utils/wrapAsync");
const passport=require("passport");

const controllerUser=require("../controllers/user.js");

router.get("/logout",controllerUser.getlogout);


router
.route("/signup")
.get(controllerUser.getsignup)
//If we donot use try-catch block and use only async(req,res) then error msg is displayed in a rabdom blank page with header and footer.But we want error to be dispalyed as msg and again see signup, for this we use try-catch block 
.post(controllerUser.postsignup);

router
.route("/login")
.get(controllerUser.getlogin)
//The authentication i.e. whether the user already exists or not is done my passport .And passport does this work as middleware ,so we will include a middleware in the post requresst
.post(passport.authenticate("local",{failureRedirect: '/login' ,failureFlash:true}),async(req,res)=>{
 req.flash("success","Welcome to Wanderlust! You are logged in!")
 res.redirect("/listing")
} )
module.exports=router;