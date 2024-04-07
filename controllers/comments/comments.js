const Post= require("../../model/post/Post");
const User=require("../../model/user/User")
const Comment=require("../../model/comment/Comment")
const appErr=require( "../../utils/appErr");
const createCommentCtrl=async(req,res,next)=>{
    const {message}=req.body;
    try{
        //find the post
        const post=await Post.findById(req.params.id);
        //create comment
        const comment=await Comment.create({
            user:req.session.userAuth,
            message,
        });
        //push the comment to the post
        post.comments.push(comment._id);
        //find the user
        const user=await User.findById(req.session.userAuth)
        user.comments.push(comment._id);
        //disable the validation
        //save
        await post.save({validateBeforeSave:false})
        await user.save({validateBeforeSave:false})
        res.redirect(`/api/v1/posts/${post._id}`);

    }catch(error){
        next(appErr(error));
    }
}

const fetchCommentCtrl=async(req,res)=>{
    try{

        res.json({
            status:'success',
            user:"comments list",
        });

    }catch(error){
        res.json(error);
    }
}

const detailsCommentCtrl=async(req,res)=>{
    try{
        res.json({
            status:'success',
            user:"comments details",
        });

    }catch(error){
        res.json(error);
    }
}

const deleteCommentCtrl=async(req,res,next)=>{
    try{
         //find post
         const comment=await Comment.findById(req.params.id)
         //check if the post belong to the user
         if (comment.user.toString() !== req.session.userAuth.toString()) {
             return next(appErr("you are not allowed to delete this comment",403))
             };
         //delete post
         await Comment.findByIdAndDelete(req.params.id);
 
         res.redirect(`/api/v1/posts/${req.query.postId}`);

    }catch(error){
        res.json(error);
    }
}

const updateCommentCtrl=async(req,res,next)=>{
    try{
        //find comment
        const comment=await Comment.findById(req.params.id)
        //check if the comment belong to the user
        if (comment.user.toString() !== req.session.userAuth.toString()) {
            return next(appErr("you are not allowed to update this comment",403))
            };
            //comment updated
            const Updated=await Comment.findByIdAndUpdate(
                req.params.id,
                {
                message:req.body.message,  
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
        next(appErr(error));
    }
}


module.exports={
createCommentCtrl,
fetchCommentCtrl,
deleteCommentCtrl,
detailsCommentCtrl,
updateCommentCtrl,
}