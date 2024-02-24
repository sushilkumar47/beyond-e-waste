require("dotenv").config();
const express =require("express");
const session=require('express-session');
const MongoStore=require( 'connect-mongo' )
const userRoutes = require("./routes/users/users");
const postRoutes=require("./routes/posts/posts")
const commentRoutes=require("./routes/comments/comments");
const globalErrHandler = require("./middlewares/globalHandler");
require('./config/dbConnect');
const app=express();

// middlewares-------------------------------
app.use(express.json())

//configure ejs
app.set("view engine","ejs");
//serve static files
app.use(express.static(__dirname + "/public"));

app.use(express.urlencoded({ extended: true })); //pass form data
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

//render home page
app.get("/",(req,res)=>{
    res.render("index")
})
//users route--------------------------------
app.use("/api/v1/users", userRoutes);
//posts route-----------------------------
app.use("/api/v1/posts",postRoutes)

//commnets route------------------------------
app.use("/api/v1/comments",commentRoutes)

//error handler middlewares
app.use(globalErrHandler);
// listen server

const PORT=process.env.PORT || 9000;

app.listen(PORT, console.log(`server running on PORT ${PORT}`));