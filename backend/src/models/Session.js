import mongoose from "mongoose"

const sessionSchema = new mongoose.Schema( 
    {
        problem:{ 
            type:String,
            required:true
        },
        difficulty:{
            type:String,
            enum:["easy","medium","hard"],
            required:true
        },
        host:{ 
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        participant:{ 
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:null
        },
        status:{ 
            type:String,
            enum:["active","completed"],
            default:"active"
        },
        callId:{ 
            type:String,
            default:""
        },
        isPrivate:{
            type:Boolean,
            default:false
        },
        finalCode:{
            type:String,
            default:""
        },
        language:{
            type:String,
            default:"javascript"
        },
        executionOutput:{
            type:String,
            default:""
        },
        notes:{
            type:String,
            default:""
        },
        rating:{
            type:String,
            enum:["", "strong_hire", "hire", "lean_hire", "lean_no_hire", "no_hire"],
            default:""
        },
        duration:{
            type:Number, // duration in minutes
            default:null
        }
    },{ 
        timestamps:true
    }
)

const Session = mongoose.model("Session", sessionSchema)
export default Session