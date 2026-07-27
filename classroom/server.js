const express=require("express");
const app=express();
const session=require("express-session");

const sessionOptions={
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true,
};

app.use(
    session({
        secret:"mysupersecretstring",
        resave:false,
        saveUninitialized:true
    })
);
app.get("/reqcount",(req,res)=>{
    if(req.session.count){
        req.session.count++;
    }
    else
    req.session.count=1;
    res.send(`You sent a request ${req.session.count} times`);
})
app.listen(3000,()=>{
    console.log("server is listening")
})
app.get("/",(req,res)=>{
    res.send("Hi, this is root!")
})