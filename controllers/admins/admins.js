const bcrypt=require( 'bcryptjs');
const User=require("../../model/user/User");
const appErr = require('../../utils/appErr');
const Admin = require('../../model/admin/Admin');
const Request = require('../../model/Request/request');
const adminRegisterCtrl=async(req,res,next)=>{
    const{fullname,email,password}=req.body;
    //check if field is empty
    if(!fullname || !email || !password){
        return res.render("admins/register",{
            error:"all field are required",
        })
    }
    try{
        //1.check if user exit(email)
        const adminFound=await User.findOne({email});
        //throw an error
        if(adminFound){
            return res.render("admins/register",{
                error:"user already exit",
            })
        }
        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword= await  bcrypt.hash(password,salt);
        //register user
        const admin=await Admin.create({
            fullname,
            email,
            password:hashedPassword,
        });
        console.log(admin)
        //redireact
        res.redirect("/admins/login")
    }catch(error){
        res.json(error); 
    }
}

const adminLoginCtrl=async(req,res,next)=> {
    const{email,password}=req.body;
    if(!email || !password){
        return res.render("admins/login",{  
            error:"email and password are required",
          })
    }

    try{
        //check if email exit
        const adminFound=await Admin.findOne({ email });
        if(!adminFound){
            //throw error
            return res.render("admins/login",{
                error:"invalid login credentials",
            })
            }
        //verify password
        const isPasswordValid= await bcrypt.compare(password,adminFound.password);
        if(!isPasswordValid){
            //throw error
            return res.render("admins/login",{
                error:"invalid login credentials",
            })
            }
           req.session.userAuth=adminFound._id;
       //redireact
       res.redirect("/admins/dashboard")
    }

    catch(error){
        res.json(error);
    }
}


const adminDashboardCtrl=async(req,res,next)=>{
    try{
        //find the user
        const users=await User.find().populate("requests")
        // const request=await Request.find()
        res.render("admins/dashboard",{ users })
    }catch(error){
        res.json(error);
    }
}

// const updateRequestStatus = async (req, res, next) => {
//     try {
//         requestId=req.params.id
//         const requestFound=await Request.findById(requestId)
  
//       const Updated=await Request.find(
//         {
//         status:req.body.status,
//         request:requestFound._id
//     },
//     {
//         new: true,
//     }
//     );
//     requestFound.requests.push(requestFound._id);
//     await requestFound.save()

//     res.json({
//         status:"sucess",
//         data:Updated,
//     })
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   };

const updateRequestStatus = async (req, res, next) => {
    try {
        const requestId = req.params.id;
        const newStatus = req.body.status;

        // Find the request by its ID
        const requestFound = await Request.findById(requestId);
        if (!requestFound) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Update the status of the request
        requestFound.status = newStatus;

        // Save the updated request
        const updatedRequest = await requestFound.save();

        // Push the updated request ID into the requests array of the corresponding user
        // const user = await User.findById(requestFound.user);
        // if (user) {
        //     user.requests.push(updatedRequest._id);
        //     await user.save();
        // }

       res.redirect("/admins/dashboard");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// const profileCtrl=async(req,res)=>{
//     try{
//         //get the login user
//         const userID=req.session.userAuth;
//         //find the user
//         const user=await User.findById(userID).populate("posts").populate("comments").populate("requests")
//         res.render("users/profile",{ user })
//     }catch(error){
//         res.json(error);
//     }
// }


const adminLogoutCtrl=async(req,res)=>{
        //destroy session
        req.session.destroy(()=>{
            res.redirect("/admins/login");
        })
  
}


module.exports={
    adminRegisterCtrl,
    adminLoginCtrl,
    adminLogoutCtrl,
    adminDashboardCtrl,
    updateRequestStatus,
}