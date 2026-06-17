const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const listingschema=new Schema({

    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        type:String,
        default:"https://images.search.yahoo.com/search/images;_ylt=Awr1TezSVTJqcQIArpCJzbkF;_ylu=Y29sbwNzZzMEcG9zAzQEdnRpZAMEc2VjA3Ny?fr=mcafee&p=nature+images&imgurl=https%3A%2F%2Fpicjumbo.com%2Fwp-content%2Fuploads%2Fbeautiful-nature-scenery-free-photo-2210x1473.jpg",
        set:(v)=> v===""?"https://images.search.yahoo.com/search/images;_ylt=Awr1TezSVTJqcQIArpCJzbkF;_ylu=Y29sbwNzZzMEcG9zAzQEdnRpZAMEc2VjA3Ny?fr=mcafee&p=nature+images&imgurl=https%3A%2F%2Fpicjumbo.com%2Fwp-content%2Fuploads%2Fbeautiful-nature-scenery-free-photo-2210x1473.jpg" : v
    },
    price:Number,
    location:String,
    country:String,
});

const Listing=mongoose.model("Listing",listingschema);
module.exports=Listing;
