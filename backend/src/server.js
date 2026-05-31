import express from "express";
import cors from "cors";
import {serve} from  "inngest/express"
import {ENV} from "./lib/env.js" //local file i.e. why we use .js extension
import { connectDB } from "./lib/db.js";
import {inngest,functions} from "./lib/inngest.js"


const app=express();



//middleware
app.use(express.json());
// credentials:true   means => server allows a browser(frontend) to include cookies on request
app.use(cors({origin:ENV.CLIENT_URL,credentials:true}))

app.use("/api/inngest",serve({client:inngest,functions}));



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