const express = require('express');
const multer=require("multer");
const storage=require("../../config/cloudinary");
const {adminRegisterCtrl,adminLoginCtrl, adminLogoutCtrl,adminDashboardCtrl,updateRequestStatus}=require("../../controllers/admins/admins")
const protected=require("../../middlewares/protected")
const adminRoutes=express.Router();


//instance of multer
const upload=multer({storage});

//--------
//rendering forms
//login
adminRoutes.get("/login",(req,res)=>{
    res.render("admins/login",{
        error:"",
    });
})
//register
adminRoutes.get("/register",(req,res)=>{
    res.render("admins/register",{
        error:"",
    });
})
//upload profile photo
// adminRoutes.get("/dashboard",protected,(req,res)=>{
//     res.render("admins/dashboard",{user,request});
// })
//upload Cover photo
// adminRoutes.get("/upload-Cover-photo-form",(req,res)=>{
//     res.render("users/uploadCoverPhoto");
// })
// //Update User pass form
// adminRoutes.get("/update-user-password",(req,res)=>{
//     res.render("users/updatePassword",{ error:"" });
// })
//---------


//register

adminRoutes.post("/register",adminRegisterCtrl);
//posts route/api/v1/users/login
adminRoutes.post("/login",adminLoginCtrl);
//Get/api/v1/users/profile
adminRoutes.get("/dashboard",protected,adminDashboardCtrl);
//put/api/v1/users/profile-upload/:id
// adminRoutes.put("/profile-photo-upload/",
// protected,
// upload.single('profile'),
// uploadProfileImgCtrl);
//put/api/v1/users/cover-photo-upload/:id
adminRoutes.post("/dashboard/:id",updateRequestStatus);
//put/api/v1/users/update-password/:id
// adminRoutes.put("/update-password",updatePasswordCtrl);
//get/api/v1/users/logout/:id
// adminRoutes.put("/update",updateUserCtrl);
//Get/api/v1/users/:id
adminRoutes.get("/logout",adminLogoutCtrl);
// adminRoutes.get("/:id",userDetailsCtrl);


module.exports=adminRoutes;