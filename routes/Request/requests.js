const express=require("express");
const multer=require("multer");
const storage=require("../../config/cloudinary");
const { scheduleReqCtrl,fetchRequestCtrl,fetchRequestsCtrl,deleteRequestCtrl } = require("../../controllers/requests/requests");
const protected=require("../../middlewares/protected");
const Request = require("../../model/Request/request");
const requestRoutes=express.Router();



//instance of multer
// const upload=multer({
//     storage,
//     })
//forms
requestRoutes.get("/request",protected,(req,res)=>{
    res.render('Request/Request',{error:""})
})

requestRoutes.get("/:id",protected,fetchRequestCtrl);
// post/api/v1/request
requestRoutes.post("/request",protected,scheduleReqCtrl);
// // Get/api/v1/posts
requestRoutes.get("/",protected,fetchRequestsCtrl);
// // Get/api/v1/posts/:id
requestRoutes.delete("/:id",protected,deleteRequestCtrl);


module.exports=requestRoutes;