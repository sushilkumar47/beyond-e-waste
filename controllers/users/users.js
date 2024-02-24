const bcrypt=require( 'bcryptjs');
const User=require("../../model/user/User");
const appErr = require('../../utils/appErr');
const registerCtrl=async(req,res,next)=>{
    const{fullname,email,password}=req.body;
    //check if field is empty
    if(!fullname || !email || !password){
        return next(appErr("all field are required"));
    }
    try{
        //1.check if user exit(email)
        const userFound=await User.findOne({email});
        //throw an error
        if(userFound){
            return next(appErr('user already exit'))
        }
        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword= await  bcrypt.hash(password,salt);
        //register user
        const user=await User.create({
            fullname,
            email,
            password:hashedPassword,
        });
        res.json({
            status:"success",
            data:user,
        });

    }catch(error){
        res.json(error);
    }
}

const loginCtrl=async(req,res,next)=> {
    const{email,password}=req.body;
    if(!email || !password){
        return next(appErr("Email and password fields are required"));
    }

    try{
        //check if email exit
        const userFound=await User.findOne({ email });
        if(!userFound){
            //throw error
                return next(appErr("invalid login credentials"))
            }
        //verify password
        const isPasswordValid= await bcrypt.compare(password,userFound.password);
        if(!isPasswordValid){
            //throw error
                return next(appErr("invalid login credentials"));
            }
           req.session.userAuth=userFound._id;
        res.json({
            status:'success',
            data:userFound,
        });
    }

    catch(error){
        res.json(error);
    }
}

const userDetailsCtrl=async(req,res)=>{
    try{
        //get userId from params
        const userId=req.params.id;
        //find the user
        const user=await User.findById(userId)
        res.json({
            status:'success',
            data:user,
        });

    }catch(error){
        res.json(error);
    }
}

const profileCtrl=async(req,res)=>{
    try{
        //get the login user
        const userID=req.session.userAuth;
        //find the user
        const user=await User.findById(userID).populate("posts").populate("comments");
        res.json({
            status:'success',
            data:user,
        });

    }catch(error){
        res.json(error);
    }
}

const uploadProfileImgCtrl=async(req,res)=>{
    console.log(req.file.path)
         try{
    
            // 1. Find the user to be updated
            const userId = req.session.userAuth;
            const userFound = await User.findById(userId);
            //2. check if user is found
            if (!userFound) {
              return next(appErr("User not found", 403));
            }
            //5.Update profile photo
            const userUpdated = await User.findByIdAndUpdate(
              userId,
              {
                profileImage: req.file.path,
              },
              {
                new: true,
              }
            );
            res.json({
              status: "success",
              data: userUpdated,
            });
          } catch (error) {
            next(appErr(error.message));
          }
        };

const uploadCoverImgCtrl=async(req,res)=>{
    try{
        res.json({
            status:'success',
            user:"user cover image upload"
        });

    }catch(error){
        res.json(error);
    }
}

const updatePasswordCtrl=async(req,res,next)=>{
    const {password}=req.body;
    try{
        //check if user is updating the password
        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword=await bcrypt.hash(password,salt);
             //update user password
            await User.findByIdAndUpdate(req.params.id,{
            password:hashedPassword,
        },
        {
            new:true,
        })
        res.json({
            status:'success',
            user:"password is updated successfully"
        });

        }      

    }catch(error){
        return next(appErr("please required password field"))
    }
}

const updateUserCtrl=async(req,res,next)=>{
    const {fullname,email,}=req.body;
    try{
        if(email){
        const emailTaken=await User.findOne({email});
        if(emailTaken){
            return next(appErr("email is taken",400))
        }
    }

    //update user
    const user=await User.findByIdAndUpdate(req.params.id,
    {
        fullname,
        email,
    },
    { 
        new: true,
    })
        res.json({
            status:'success',
            data:user,
        });

    }catch(error){
        return next(appErr(error.message))
    }
}
const logoutCtrl=async(req,res)=>{
    try{
        res.json({
            status:'success',
            user:"user logout"
        });

    }catch(error){
        res.json(error);
    }
}


module.exports={
    registerCtrl,
    loginCtrl,
    userDetailsCtrl,
    profileCtrl,
    uploadProfileImgCtrl,
    uploadCoverImgCtrl,
    updatePasswordCtrl,
    updateUserCtrl,
    logoutCtrl
}