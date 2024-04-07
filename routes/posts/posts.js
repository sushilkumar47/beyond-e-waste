const express=require("express");
const multer=require("multer");
const storage=require("../../config/cloudinary");
const { createPostCtrl,fetchPostCtrl,fetchPostsCtrl,deletePostCtrl,updatePostCtrl } = require("../../controllers/posts/posts");
const protected=require("../../middlewares/protected");
const Post = require("../../model/post/Post");
const postRoutes=express.Router();


//instance of multer
const upload=multer({
    storage,
    })
//forms
postRoutes.get("/get-post-form",(req,res)=>{
    res.render('posts/addPost',{error:""})
})

postRoutes.get("/get-form-update/:id",async (req,res)=>{
    try{
        const post=await Post.findById(req.params.id);
        res.render("posts/updatePost",{post, error:""});

    }catch(error){
        res.render( "posts/updatePost", { error, post:"" });

    }
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