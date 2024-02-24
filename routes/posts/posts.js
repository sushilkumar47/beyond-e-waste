const express=require("express");
const multer=require("multer");
const storage=require("../../config/cloudinary");
const { createPostCtrl,fetchPostCtrl,fetchPostsCtrl,deletePostCtrl,updatePostCtrl } = require("../../controllers/posts/posts");
const protected=require("../../middlewares/protected")
const postRoutes=express.Router();

//instance of multer
const upload=multer({
    storage,
    })

// post/api/v1/posts
postRoutes.post("/",protected, upload.single("file"),createPostCtrl);
// Get/api/v1/posts
postRoutes.get("/",fetchPostsCtrl);
// Get/api/v1/posts/:id
postRoutes.get("/:id",fetchPostCtrl);
// Delete/api/v1/posts/:id
postRoutes.delete("/:id",protected,deletePostCtrl);
// put/api/v1/posts/:id
postRoutes.put("/:id",protected,updatePostCtrl);

module.exports=postRoutes;