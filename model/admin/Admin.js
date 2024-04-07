const mongoose=require("mongoose");

const adminSchema = new mongoose.Schema({
    fullname:{
        type: String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required: true,
    },
    posts:[{type:mongoose.Schema.Types.ObjectId,ref:"Post"}],
    comments:[{type:mongoose.Schema.Types.ObjectId,ref:'Comment'}],
    requests:[{type:mongoose.Schema.Types.ObjectId,ref:'Request'}],
    users:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    },
    {
        timestamps:true,
    });

    const Admin=mongoose.model("Admin",adminSchema);
    
    module.exports=Admin; 
   