require("dotenv").config();
const express =require("express");
const session=require('express-session');
const MongoStore=require( 'connect-mongo' )
const methodOverride=require("method-override")
const userRoutes = require("./routes/users/users");
const postRoutes=require("./routes/posts/posts")
const commentRoutes=require("./routes/comments/comments");
const globalErrHandler = require("./middlewares/globalHandler");
const Post = require("./model/post/Post");
const { truncatePost } = require("./utils/helpers");
const requestRoutes = require("./routes/Request/requests");
const adminRoutes = require("./routes/admins/admins");
const User = require("./model/user/User");
require('./config/dbConnect');
const app=express();

//helpers
app.locals.truncatePost=truncatePost;
// middlewares-------------------------------
app.use(express.json())
//configure ejs
app.set("view engine","ejs");
//serve static files
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true })); //pass form data
//method override
app.use(methodOverride("_method"))
//session config
app.use(session({
    secret: "process.env.SESSION_KEY",
    resave: false,
    saveUninitialized: true,
    store:new MongoStore({
        mongoUrl:process.env.MONGO_URL,
        ttl:24*60*60,//1day
    })
}));
//save the login user into locals
app.use((req,res,next)=>{
    if(req.session.userAuth){
        res.locals.userAuth=req.session.userAuth;
    }else{
        res.locals.userAuth=null;
    }
    next()
})
//render home page
app.get("/",async(req,res)=>{
    try{
        const posts=await Post.find().populate("user")
        res.render("index",{posts})
    }
    catch(error){
        res.render("index",{error:error.message})
    }
})

//render admin dashboard
// app.get("/admins/dashboard",async(req,res)=>{
//     try{
//         const user=await User.find().populate("user")
//         res.render("admins/dashboard",{user})
//     }
//     catch(error){
//         res.render("admins/dashboard",{error:error.message})
//     }
// })
//users route--------------------------------
app.use("/api/v1/users", userRoutes);
//posts route-----------------------------
app.use("/api/v1/posts",postRoutes)
//commnets route------------------------------
app.use("/api/v1/comments",commentRoutes)
//request route------------------------
app.use("/api/v1/request",requestRoutes)
// admin routes--------------------------
app.use("/admins",adminRoutes)
//error handler middlewares
app.use(globalErrHandler);
// listen server
const PORT=process.env.PORT || 9000;

app.listen(PORT, console.log(`server running on PORT ${PORT}`));