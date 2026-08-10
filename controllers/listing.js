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

module.exports.create = async (req, res) => {

    let url = req.file.path;
    let filename = req.file.filename;

    let lis = new Listing(req.body.Listing);

    lis.owner = req.user._id;
    lis.image = { url, filename };

    try {

        // Location entered by user
        const location =
            `${req.body.Listing.location}, ${req.body.Listing.country}`;

        console.log("Searching location:", location);

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(location)}`,
            {
                headers: {
                    "User-Agent": "WanderLust/1.0"
                },
                signal: AbortSignal.timeout(10000)
            }
        );

        if (!response.ok) {
            throw new Error(`Nominatim returned ${response.status}`);
        }

        const geoData = await response.json();

        console.log("Geocoding result:", geoData);

        if (geoData.length === 0) {
            req.flash("error", "Location could not be found!");
            return res.redirect("/listing/new");
        }

        lis.geometry = {
            type: "Point",
            coordinates: [
                parseFloat(geoData[0].lon),
                parseFloat(geoData[0].lat)
            ]
        };

        await lis.save();

        req.flash("success", "New Listing created!");
        res.redirect("/listing");

    } catch (error) {

        console.log("Geocoding error:", error);

        req.flash(
            "error",
            "Could not find the location. Please try again."
        );

        res.redirect("/listing/new");
    }
};

 module.exports.edit=async (req, res) => {
    let {id}=req.params;
        const data= await Listing.findById(id);
    if(!data){
        req.flash("error","Listing you request donot exist!")
        res.redirect("/listing");
     }

    else{
        let orimageurl=data.image.url;
        orimageurl=orimageurl.replace("/upload","upload/h_300,w_250")
        res.render("./listings/edit.ejs",{data,orimageurl});
    }

}

module.exports.update=async(req,res)=>{
    let {id}=req.params;
    const data= await Listing.findByIdAndUpdate(id, {...req.body.Listing});
    
    if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    data.image={url,filename};
    await data.save();
    }
    req.flash("success","Updated Successfully !")
    res.redirect(`/listing/${id}`);   
}

module.exports.delete=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted successfully!")
    res.redirect("/listing");
}