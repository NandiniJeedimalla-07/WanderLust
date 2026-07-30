const express=require("express");
const router=express.Router();
const User=require("../MODELS/user.js");
const wrapAsync=require("../utils/wrapAsync");
const passport=require("passport");

router.get("/signup",(req,res)=>{
    // res.send("form");
    res.render("users/signup.ejs");
})
//If we donot use try-catch block and use only async(req,res) then error msg is displayed in a rabdom blank page with header and footer.But we want error to be dispalyed as msg and again see signup, for this we use try-catch block 
router.post("/signup",async(req,res)=>{
    try{
    let {email,username,password}=req.body;
    const newUser=new User({email,username});
    const register=await User.register(newUser,password);
    req.flash("success","Welcome to WanderLust! ");
    res.redirect("/listing");
    }catch(e){
      req.flash("error",e.message);
      res.redirect("/signup");
    }
})

router.get("/login",async(req,res)=>{
    res.render("users/login.ejs");
})
//The authentication i.e. whether the user already exists or not is done my passport .And passport does this work as middleware ,so we will include a middleware in the post requresst

router.post("/login",passport.authenticate("local",{failureRedirect: '/login' ,failureFlash:true}),async(req,res)=>{
 res.flash("success","Welcome to Wanderlust! You are logged in!")
 res.redirect("/listing")
} )
module.exports=router;