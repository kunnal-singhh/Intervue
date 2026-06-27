import Session from "../models/Session.js";
import { chatClient,streamClient } from "../lib/stream.js";

export async function createSession(req,res){ 
    try {
        const {problem,difficulty}=req.body;
        const userId=req.user._id;
        const clerkId=req.user.clerkId

        if(!problem || !difficulty){ 
            return res.status(400).json({message:"problem and difficulty are required"})
        }

        //generate a unique call id for stream video
        const callId=`session_${Date.now()}_${Math.random().toString().substring(7)}`;

        //create sessiom in DB
          const session=await Session.create({problem,difficulty,host:userId,callId});

       // create stream video call
       await streamClient.video.call("default",callId).getOrCreate({ 
        data:{ 
            created_by_id:clerkId,
        custom:{problem,difficulty,sessionId:session._id.toString()}
        },
       });

   //chat messaging
   chatClient.channel("messaging",callId,{ 
    name:`${problem} Session`,
    created_by_id:clerkId,
    members:[clerkId]
   })
         
   await channel.create()
   res.status(201).json({session:sessiom})

    } catch (error) {
        console.log("Error in createSession controller",error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
}
export async function getActiveSessions(_,res){  
    try{ 
        const sessions=await Session.find({status:"active"})
        .populate("host","name profileImage email clerkId")
        .sort({createdAt:-1})
        .limit(20)
        res.status(200).json({sessions})
    }   
    catch(error){ 
        console.log("Error in getActiveSessions controller",error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
}
export async function getMyRecentSessions(req,res){ 
    try {
        const userId=req.user._id;
        //get sessions where user is either host or participant
        const sessions=await Session.find({
            status:"completed" ,
            $or:[{host:userId},{participant:userId}]
        }).sort({updatedAt:-1}).limit(20)
        res.status(200).json({sessions})
    } catch (error) {
        console.log("Error in getMyRecentSessions controller",error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
}
export async function getSessionById(req,res){ 
    try {
        const {id}=req.params;
        const session=await Session.findById(id)
        .populate("host","name profileImage email clerkId")
        .populate("participant","name profileImage email clerkId")
        if(!session){ 
            return res.status(404).json({message:"Session not found"})
        }
        res.status(200).json({session})
    } catch (error) {
        console.log("Error in getSessionById controller",error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
}
export async function joinSession(req,res){ 
    try {
        const {id}=req.params;
        const userId=req.user._id;
        const clerkId=req.user.clerkId;
        const session=await Session.findById(id);
        if(!session){
            return res.status(404).json({message:"Session not found"})
        }
        if(session.participant) return res.status(400).json({message:"Session already has a participant"})
        session.participant=userId;
        await session.save();

        // const call=streamClient.video.call("default",session.callId)
        // await call.addParticipant(clerkId)

     const channel=chatClient.channel("messaging",session.callId)
     await channel.addMembers([clerkId])

        res.status(200).json({session})
    } catch (error) {
        console.log("Error in joinSession controller",error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
}
export async function endSession(req,res){ 
    try {
        const {id}=req.params;
        const userId=req.user._id;
        const session=await Session.findById(id);
        if(!session){
            return res.status(404).json({message:"Session not found"})
        }
        //check if user is the host of the session
        if(session.host.toString() !== userId.toString()){
            return res.status(403).json({message:"You are not the host of this session"})
        }
        if(session.status==="completed"){
            return res.status(400).json({message:"Session is already completed"})
        }
        session.status="completed";
        await session.save();
     // delete the stream video call
      const call=  streamClient.video.call("default",session.callId)
      await call.delete()
     //delete the chat channel
      const channel=chatClient.channel("messaging",session.callId)
       await channel.delete()

        res.status(200).json({session,message:"Session ended successfully"})
    } catch (error) {
        console.log("Error in endSession controller",error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
 }
