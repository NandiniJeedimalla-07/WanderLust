const Listing=require("../MODELS/listing.js")

module.exports.index=async (req,res)=>{
    let allListing=await Listing.find({});
    console.log(allListing);
    res.render("./listings/index.ejs",{allListing});
}

module.exports.newform=(req,res)=>{
    res.render("./listings/newform.ejs");
}


module.exports.show=async(req,res)=>{
    let {id}=req.params;
    const data= await Listing.findById(id).populate({path:"reviews",populate:{
        path:"author",},
    }).populate("owner");
    // console.log(data);
    if(!data){
        req.flash("error","Listing you requested do not exist!")
        res.redirect("/listing")
    }
    else
    res.render("./listings/show.ejs",{data});
}

module.exports.create=async (req,res)=>{
    // if(!req.body.Listing){
    //     throw new ExpressError(400,"send valid data for listing");
    // }
    let url=req.file.path;
    let filename=req.file.filename;
    //  let result=listingSchema.validate(req.body);
    //  if(result.error){
    //     throw new ExpressError(400,result.error);
    //  }
         let lis=new Listing(req.body.Listing);
         lis.owner=req.user._id;
         lis.image={url,filename};
         await lis.save();
         req.flash("success","New Listing created !")
        res.redirect("/listing")  
}

 module.exports.edit=async (req, res) => {
    console.log("edit route reached!")
    let {id}=req.params;
        const data= await Listing.findById(id);
    if(!data){
        req.flash("error","Listing you request donot exist!")
        res.redirect("/listing");
     }
     else{
    res.render("./listings/edit.ejs",{data});
     }

}

module.exports.update=async(req,res)=>{
     let {id}=req.params;
     const data= await Listing.findByIdAndUpdate(id, {...req.body.Listing});
      req.flash("success","Updated Successfully !")
      res.redirect(`/listing/${id}`);   
}

module.exports.delete=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted successfully!")
    res.redirect("/listing");
}