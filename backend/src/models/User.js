import mongoose from 'mongoose';

const userSchema=new mongoose.Schema(
    { 
       name:{ 
        type:String,
        required:true,
       },
       email:{ 
        type:String,
        required:true,
        unique:true,
       },
       profileImage:{ 
        type:String,
        default:"",
       },
       clerkId:{ 
        type:String,
        required:true,
        unique:true
       },
       solvedProblems: [
         {
           problemId: { type: String, required: true },
           solvedAt: { type: Date, default: Date.now },
           language: { type: String, default: "javascript" },
         },
       ],
    },
    {timestamps:true}  //created AT, updated AT
)
const User=mongoose.model("User",userSchema)
export default User 