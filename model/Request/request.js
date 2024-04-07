const mongoose=require("mongoose");

const requestSchema=new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            // required: true,
          },
        items:{
            type:String,
            // required:true,
            enum:["Computer","Laptop","Printer","Mobile","TV","Refrigerator","Washing Machine","Camera","Mix E waste","other"],

        },
        weight:{
            type:String,
            // required:true,
            enum:["less than 7kg","less than 20kg","20-50kg","50-100kg","above 100kg"],

        },
        phone:{
            type:Number,
            // required:true,
        },
        address: {
            type:String,
            // required:true,
        },
        pincode: {
            type:Number,
            // required:true,
        },
        date: {
            type:String,
            // required:true,
        },status: {
            type: String,
            enum: ['process', 'completed', 'canceled'],
            default: 'process'
          }
    },
       {
        timestamps: true,
    }

);

const Request=mongoose.model("Request",requestSchema);

module.exports = Request;