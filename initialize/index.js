const mongoose=require("mongoose");
const initiData=require("./data.js");
const Listing=require("../models/listing.js");


async function  main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main().then(()=>{
    console.log("connected to DB!");
}).catch(err=>{
    console.log(err)});


const initDB =async () =>{
    await Listing.deleteMany({});
    await Listing.insertMany(initiData.data);
    console.log("Data was initialized");
}

initDB();
