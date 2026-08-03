const User=require("../MODELS/user.js")

module.exports.getsignup=(req,res)=>{
    // res.send("form");
    res.render("users/signup.ejs");
}

module.exports.postsignup=async(req,res)=>{
    try{
    let {email,username,password}=req.body;
    const newUser=new User({email,username});
    const register=await User.register(newUser,password);
    req.login(register,(err)=>{
        if(err)
          return next(err);
    })
    req.flash("success","Welcome to WanderLust! ");
    res.redirect("/listing");
    }catch(e){
      req.flash("error",e.message);
      res.redirect("/signup");
    }
}

module.exports.getlogin=async(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.getlogout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listing")
    })
}