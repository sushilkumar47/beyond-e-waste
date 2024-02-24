const User=require("../../model/user/User")
const Post=require("../../model/post/Post")
const appErr=require('../../utils/appErr')


const createPostCtrl=async(req,res,next)=>{
    const{title,description,category,user}=req.body;
    try{
        if(!title || !description || !category){
            return next(appErr("all fields are required"));
        }
        //find the user
        const userId=req.session.userAuth;
        const userFound=await User.findById(userId);

        //create post
        const postCreated=await Post.create({
            title,
            description,
            category,
            user:userFound._id,
            // image:req.file.path
           
        });
         //push the post created into the array of users post
        userFound.posts.push(postCreated._id);
        //save user
        await  userFound.save();
        res.json({
            status:'success',
            data:postCreated
        });

    }catch(error){
        return next(appErr(error.message));
    }
}

const fetchPostsCtrl=async(req,res,next)=>{
    try{
        const posts=await Post.find().populate("comments");
        res.json({
            status:'success',
            data:posts
        });

    }catch(error){
        return  next(appErr(error));
    }
}

const fetchPostCtrl=async(req,res,next)=>{
    try{
        //get the id from params
        const id=req.params.id
        //find the post
        const post=await Post.findById(id).populate("comments");
        res.json({
            status:'success',
            data:post
        });

    }catch(error){
        return next(appErr(error.message));
    }
}

const deletePostCtrl=async(req,res,next)=>{
    try{
        //find post
        const post=await Post.findById(req.params.id)
        //check if the post belong to the user
        if (post.user.toString() != req.session.userAuth.toString()) {
            return next(appErr("you are not allowed to delete this post",403))
            };
        //delete post
        await Post.findByIdAndDelete(req.params.id);

        res.json({
            status:'success',
            data:"post has been deleted successfully",
        });

    }catch(error){
       return next(appErr(error.message));
    }
}

const updatePostCtrl=async(req,res,next)=>{
    // const{title,description,category}=req.body;
    // if(!title || !description || !category){
    //     return next(appErr("all fields are required"));
    // }
    try{
        const post=await Post.findById(req.params.id)
        //check if the post belong to the user
        if (post.user.toString() !== req.session.userAuth.toString()) {
            return next(appErr("you are not allowed to update this post",403))
            };
            //post updated
            const Updated=await Post.findByIdAndUpdate(
                req.params.id,
                {
                title:req.body.title,
                description:req.body.description,
                category:req.body.category,
                // image:req.file.path,
            },
            {
                new: true,
            }
            );
        res.json({
            status:'success',
            data:Updated,
        });

    }catch(error){
        return next(appErr(error.message));
    }
}


module.exports={
    createPostCtrl,
    fetchPostCtrl,
    fetchPostsCtrl,
    deletePostCtrl,
    updatePostCtrl,
}