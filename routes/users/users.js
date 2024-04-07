const express = require('express');
const multer=require("multer");
const storage=require("../../config/cloudinary");
const { registerCtrl,loginCtrl,userDetailsCtrl,profileCtrl,uploadProfileImgCtrl,uploadCoverImgCtrl,updatePasswordCtrl,updateUserCtrl, logoutCtrl } = require('../../controllers/users/users');
const protected=require("../../middlewares/protected")
const userRoutes=express.Router();


//instance of multer
const upload=multer({storage});

//--------
//rendering forms
//login
userRoutes.get("/login",(req,res)=>{
    res.render("users/login",{
        error:"",
    });
})
//register
userRoutes.get("/register",(req,res)=>{
    res.render("users/register",{
        error:"",
    });
})
//upload profile photo
userRoutes.get("/upload-profile-photo-form",(req,res)=>{
    res.render("users/uploadProfilePhoto");
})
//upload Cover photo
userRoutes.get("/upload-Cover-photo-form",(req,res)=>{
    res.render("users/uploadCoverPhoto");
})
//Update User pass form
userRoutes.get("/update-user-password",(req,res)=>{
    res.render("users/updatePassword",{ error:"" });
})
//---------


//register

userRoutes.post("/register", upload.single("profile"),registerCtrl);
//posts route/api/v1/users/login
userRoutes.post("/login",loginCtrl);
//Get/api/v1/users/profile
userRoutes.get("/profile-page",protected,profileCtrl);
//put/api/v1/users/profile-upload/:id
userRoutes.put("/profile-photo-upload/",
protected,
upload.single('profile'),
uploadProfileImgCtrl);
//put/api/v1/users/cover-photo-upload/:id
userRoutes.put("/cover-photo-upload/:id",uploadCoverImgCtrl);
//put/api/v1/users/update-password/:id
userRoutes.put("/update-password",updatePasswordCtrl);
//get/api/v1/users/logout/:id
userRoutes.put("/update",updateUserCtrl);
//Get/api/v1/users/:id
userRoutes.get("/logout",logoutCtrl);
userRoutes.get("/:id",userDetailsCtrl);


module.exports=userRoutes;