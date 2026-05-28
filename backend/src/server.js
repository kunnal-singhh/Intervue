import express from "express";
import {ENV} from "./lib/env.js" //local file i.e. why we use .js extension
import { connectDB } from "./lib/db.js";
const app=express();

app.get("/",(req,res)=>{ 
    res.status(200).json({msg:"success from api"})
})


const startServer=async ()=>{ 
    try{ 
        await connectDB();
app.listen(ENV.PORT,()=> {
    console.log("server is running on port",ENV.PORT)
   
});
    }catch(error){ 
      console.log("💥Error starting server")
    }
}
startServer()