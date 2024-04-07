const User=require("../../model/user/User")
const Post=require("../../model/post/Post")
const Request = require('../../model/Request/request');
const appErr=require('../../utils/appErr')


const scheduleReqCtrl=async(req,res,next)=>{
    const{phone,items,address,pincode,date,weight}=req.body;
    try{
        if(!phone || !address  || !pincode || !date){
            return res.render("Request/Request",{error:"all fields are required"})
        }
        const userId=req.session.userAuth;
        const userFound=await User.findById(userId);
        console.log(userFound)
        //create post
        const requestSchedule=await Request.create({
            phone,
            items,
            address,
            pincode,
            date,
            weight,
            user:userFound._id,        
        });

        userFound.requests.push(requestSchedule._id);
        // // //save user
        await userFound.save();
       //redireact
       res.redirect("/api/v1/users/profile-page")
    }catch(error){
        return res.render("Request/Request",{error:error.message})

    }
}

const fetchRequestCtrl=async(req,res,next)=>{
    try{
        const id=req.params.id 
        const request = await Request.findById(id)
        res.json({
            status:'success',
            data:request,
        });

    }catch(error){
        return  next(appErr(error.message));
    }
}

const fetchRequestsCtrl=async(req,res,next)=>{
    try{
        const requests=await Request.find().populate("user")
        res.json({
            status:'success',
            data:requests,
        });

    }catch(error){
        return  next(appErr(error));
    }
}

const deleteRequestCtrl=async(req,res,next)=>{
    try{
        //find post
        const request=await Request.findById(req.params.id)
        //check if the post belong to the user
        if (request.user.toString() != req.session.userAuth.toString()) {
            return res.render("users/profile",{
                error:"you are not allowed to delete this post",
                request,
            })
            };
        //delete post
        await Request.findByIdAndDelete(req.params.id);

        // redireact
        res.redirect("/api/v1/users/profile-page")

    }catch(error){
        return res.render("users/profile",{
            error:error.message,
            request:"",
        })
    }
}


module.exports={
    scheduleReqCtrl,
    fetchRequestCtrl,
    fetchRequestsCtrl,
    deleteRequestCtrl,
}