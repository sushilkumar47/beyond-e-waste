const bcrypt=require( 'bcryptjs');
const User=require("../../model/user/User");
const appErr = require('../../utils/appErr');
const registerCtrl=async(req,res,next)=>{
    const{fullname,email,password}=req.body;
    //check if field is empty
    if(!fullname || !email || !password){
        return res.render("users/register",{
            error:"all field are required",
        })
    }
    try{
        //1.check if user exit(email)
        const userFound=await User.findOne({email});
        //throw an error
        if(userFound){
            return res.render("users/register",{
                error:"user already exit",
            })
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
        //redireact
        res.redirect("/api/v1/users/login")
    }catch(error){
        res.json(error); 
    }
}

const loginCtrl=async(req,res,next)=> {
    const{email,password}=req.body;
    if(!email || !password){
        return res.render("users/login",{  
            error:"email and password are required",
          })
    }

    try{
        //check if email exit
        const userFound=await User.findOne({ email });
        if(!userFound){
            //throw error
            return res.render("users/login",{
                error:"invalid login credentials",
            })
            }
        //verify password
        const isPasswordValid= await bcrypt.compare(password,userFound.password);
        if(!isPasswordValid){
            //throw error
            return res.render("users/login",{
                error:"invalid login credentials",
            })
            }
           req.session.userAuth=userFound._id;
       //redireact
       res.redirect("/")
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
        res.render("users/updateUser",{
          user,  
          error:"",
        })

    }catch(error){
        res.render("users/updateUser",{ 
            error:error.message,
          })
    }
}

const profileCtrl=async(req,res)=>{
    try{
        //get the login user
        const userID=req.session.userAuth;
        //find the user
        const user=await User.findById(userID).populate("posts").populate("comments").populate("requests")
        res.render("users/profile",{ user })
    }catch(error){
        res.json(error);
    }
}

const uploadProfileImgCtrl=async(req,res)=>{
         try{
            if(!req.file){
                return res.render("users/uploadProfilePhoto",{
                    error:"please uplaod image",
                });
            } 
            // 1. Find the user to be updated
            const userId = req.session.userAuth;
            const userFound = await User.findById(userId);
            //2. check if user is found
            if (!userFound) {
                return res.render("users/uploadProfilePhoto",{
                    error:"user not found",
                });
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
            //redireact
            res.redirect("/api/v1/users/profile-page")
          } catch (error) {
            return res.render("users/uploadProfilePhoto",{
                error:error.message,
            });
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
            await User.findByIdAndUpdate(req.session.userAuth,{
            password:hashedPassword,
        },
        {
            new:true,
        })
        res.redirect("/api/v1/users/profile-page")
        }      

    }catch(error){
        return res.render("users/updatePassword",{
            error:error.message,
        });
    }
}

const updateUserCtrl=async(req,res,next)=>{
    const {fullname,email,}=req.body;
    try{
        if(!fullname || !email){
            return res.render("users/updateUser",{
                error:"please provide details",
                user:"",
            });  
        }
        if(email){
        const emailTaken=await User.findOne({email});
        if(emailTaken){
            return res.render("users/updateUser",{
                error:"email is taken",
                user:"",
            });
        }
    }

    //update user
    await User.findByIdAndUpdate(req.session.userAuth,
    {
        fullname,
        email,
    },
    { 
        new: true,
    })
    res.redirect("/api/v1/users/profile-page")
    }catch(error){
        return res.render("users/updateUser",{
            error:error.message,
            user:'',
        });
    }
}
const logoutCtrl=async(req,res)=>{
        //destroy session
        req.session.destroy(()=>{
            res.redirect("/api/v1/users/login");
        })
  
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