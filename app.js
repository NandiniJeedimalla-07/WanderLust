const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./MODELS/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));//It is middleware that allows Express to read data sent from an HTML form (POST request).
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));


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

//INDEX ROUTE
app.get("/listing",wrapAsync(async (req,res)=>{
    let allListing=await Listing.find({});
    console.log(allListing);
    res.render("./listings/index.ejs",{allListing});
}));

//SHOW ROUTE
app.get("/listing/:id" , wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const data= await Listing.findById(id);
    console.log(data);
    res.render("./listings/show.ejs",{data});
}));
//NEW ROUTE
app.get("/listings/new",(req,res)=>{
    res.render("./listings/newform.ejs");
})
//CREATE ROUTE
app.post("/listing",wrapAsync(async (req,res)=>{
    // if(!req.body.Listing){
    //     throw new ExpressError(400,"send valid data for listing");
    // }
     let result=listingSchema.validate(req.body);
     if(result.error){
        throw new ExpressError(400,result.error);
     }
         let lis=new Listing(req.body.Listing);
         await lis.save()
         res.redirect("/listing");   
}));
//EDIT ROUTE(form)
app.get("/listing/:id/edit",wrapAsync( async (req, res) => {
    let {id}=req.params;
    const data= await Listing.findById(id);
    res.render("./listings/edit.ejs",{data});

}));

//UPDATE ROUTE
app.put("/listing/:id",wrapAsync(async(req,res)=>{
     let {id}=req.params;
      await Listing.findByIdAndUpdate(id, {...req.body.Listing});
    res.redirect(`/listing/${id}`);
}));
//DELETE ROUTE
app.delete("/listing/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
}));
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
