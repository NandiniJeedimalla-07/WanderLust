const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./MODELS/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Reviews=require("./MODELS/reviews.js");
const listing=require("./routes/listing.js");
const reviews=require("./routes/reviews.js");
const user=require("./routes/user.js")
const sessions=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const localstrategy=require("passport-local");
const User=require("./MODELS/user.js");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));//It is middleware that allows Express to read data sent from an HTML form (POST request).
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));
   

const sessionOptions={
    secret:"mysupersecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+1000*60*60*24*3,
        maxAge:1000*60*60*24*3,
    }
};

app.use(sessions(sessionOptions));
app.use(flash());
//middleware that initializes passport
app.use(passport.initialize());
//a web application neeeds the ability to identify users as they browse form page to page.This series of requests and responses, each associated wtiht the same user, is known as session . 
app.use(passport.session());
passport.use(new localstrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})
async function  main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main().then(()=>{
    console.log("connected to DB!");
}).catch(err=>{
    console.log(err)});


app.get("/",(req,res)=>{
    res.send("Hi,this is root!");
})

app.get("/testlisting",async (req,res)=>{
    let samplelisting=new Listing({
        title:"My new Villa",
        description:"Beach view",
        price:2000,
        location: "Lakshmipuram ,guntur",
        country:"India"
    });

    await samplelisting.save();
    console.log("added successfully");
    res.send("successful execution!");

})

 const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errormsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errormsg);
    }else
    next();
 }

const validateReviews=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errormsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errormsg);
    }else
    next();
}

 app.get("/demoUser",async(req,res)=>{
    let fakeuser=new User({
        email:"student@gmail.com",
        username:"student"
    })
    let registereduser=await User.register(fakeuser,"helloworld")//helloworld is password here 
     res.send(registeredUser);
})

app.use("/listing",listing);
app.use("/listing/:id/reviews",reviews);
app.use("/",user);
//* matches with any route .this gets called when none of the above gets matched 
app.use((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});
app.get("/deleteNullPrice", async (req, res) => {
    const result = await Listing.deleteOne({ price: null });
    res.send(result);
});
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
    res.render("listings/error.ejs",{message});
  //  res.status(statusCode).send(message);
});

app.listen(8080,()=>{
    console.log("server is working!")
});
