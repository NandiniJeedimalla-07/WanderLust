const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const reviews = require("./reviews.js");

const listingschema=new Schema({

    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        // type:String,
        // default: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200",
        // set:(v)=> v===""?"https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200" : v
        url:String,
        filename:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Reviews"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }

});

listingschema.post("findOneAndDelete",async(Listing)=>{
    await reviews.deleteMany({_id: {$in:Listing.reviews}});
});

const Listing=mongoose.model("Listing",listingschema);
module.exports=Listing;
