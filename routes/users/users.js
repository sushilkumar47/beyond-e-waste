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
    res.render("users/login");
})
//register
userRoutes.get("/register",(req,res)=>{
    res.render("users/register");
})
//profile
userRoutes.get("/profile-page",(req,res)=>{
    res.render("users/profile");
})
//upload profile photo
userRoutes.get("/upload-profile-photo-form",(req,res)=>{
    res.render("users/uploadProfilePhoto");
})
//upload Cover photo
userRoutes.get("/upload-Cover-photo-form",(req,res)=>{
    res.render("users/uploadCoverPhoto");
})
//Update User Form
userRoutes.get("/update-user-form",(req,res)=>{
    res.render("users/updateUser");
})
//---------


//register

userRoutes.post("/register",registerCtrl);
//posts route/api/v1/users/login
userRoutes.post("/login",loginCtrl);
//Get/api/v1/users/profile
userRoutes.get("/profile",protected,profileCtrl);
//put/api/v1/users/profile-upload/:id
userRoutes.put("/profile-photo-upload/",
protected,
upload.single('photo'),
uploadProfileImgCtrl);
//put/api/v1/users/cover-photo-upload/:id
userRoutes.put("/cover-photo-upload/:id",uploadCoverImgCtrl);
//put/api/v1/users/update-password/:id
userRoutes.put("/update-password/:id",updatePasswordCtrl);
//get/api/v1/users/logout/:id
userRoutes.put("/update/:id",updateUserCtrl);
//Get/api/v1/users/:id
userRoutes.get("/:id",userDetailsCtrl);
userRoutes.get("/logout/:id",logoutCtrl);

module.exports=userRoutes;