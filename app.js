const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./MODELS/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");


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
app.get("/listing", async (req,res)=>{
    let allListing=await Listing.find({});
    console.log(allListing);
    res.render("./listings/index.ejs",{allListing});
})

//SHOW ROUTE
app.get("/listing/:id" , async(req,res)=>{
    let {id}=req.params;
    const data= await Listing.findById(id);
    console.log(data);
    res.render("./listings/show.ejs",{data});
})
//NEW ROUTE
app.get("/listings/new",(req,res)=>{
    res.render("./listings/newform.ejs");
})
//CREATE ROUTE
app.post("/listing",async (req,res)=>{
    try{
         let lis=new Listing(req.body.Listing);
     await lis.save()
     res.redirect("/listing");
    } catch(err){
        next(err);
    }
    
})
//EDIT ROUTE(form)
app.get("/listing/:id/edit", async (req, res) => {
    let {id}=req.params;
    const data= await Listing.findById(id);
    res.render("./listings/edit.ejs",{data});

});

//UPDATE ROUTE
app.put("/listing/:id",async(req,res)=>{
     let {id}=req.params;
      await Listing.findByIdAndUpdate(id, {...req.body.Listing});
    res.redirect(`/listing/${id}`);
})
//DELETE ROUTE
app.delete("/listing/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
})
app.get("/deleteNullPrice", async (req, res) => {
    const result = await Listing.deleteOne({ price: null });
    res.send(result);
});
//ERROR HANDLING MIDDLEWARE
app.use((err,req,res,next)=>{
res.send("something went wrong");
});

app.listen(8080,()=>{
    console.log("server is working!")
});
