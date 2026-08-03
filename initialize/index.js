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
    initiData.data=initiData.data.map((obj)=>({...obj,owner:"6a6b6ff2b3a1d067f65cf4c1"
    }));
    await Listing.insertMany(initiData.data);
    console.log("Data was initialized");
}

initDB();
