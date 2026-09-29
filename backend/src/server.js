import express from "express";
import cors from "cors";
import {serve} from  "inngest/express"
import {ENV} from "./lib/env.js" //local file i.e. why we use .js extension
import { connectDB } from "./lib/db.js";
import {inngest,functions} from "./lib/inngest.js"
import { clerkMiddleware } from '@clerk/express'
import chatRoutes from "./routes/chatRoutes.js"
import sessionRoutes from "./routes/sessionRoutes.js";
import codeRoutes from "./routes/codeRoutes.js";
import userRoutes from "./routes/userRoutes.js";


const app=express();

// credentials:true   means => server allows a browser(frontend) to include cookies on request
app.use(cors({origin:ENV.CLIENT_URL,credentials:true}))

//middleware

// Calling express.json() configures(like some custom values express.json({ limit: '2mb' })) it 
// and returns a standard middleware(req, res, next) function
//Express then takes that returned middleware function and plugs it into the app.use() routing stack.
app.use(express.json());


//global clerk auth middleware  =>  it will run on every request and check if the user is authenticated or not 
// and if authenticated it will attach the auth object(conatins user information) to the request object otherwise it will leave the auth object as empty
// this auth object can be accessed in the route handler using getAuth(req) method
app.use(clerkMiddleware())


//routes
app.use("/api/inngest",serve({client:inngest,functions}));
app.use("/api/chat",chatRoutes)  // all routes in chatRoutes will be prefixed with /api/chat
app.use("/api/sessions",sessionRoutes)  // all routes in sessionRoutes will be prefixed with /api/sessions
app.use("/api/code",codeRoutes)
app.use("/api/user",userRoutes)


app.get("/health",(req,res)=>{ 
    res.status(200).json({msg:"success from api"})
})


const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => {
      console.log(`🚀 Server is running on port ${ENV.PORT}`);
    });
  } catch (error) {
    console.error("💥 Error starting server:", error.message);
    process.exit(1);
  }
};
startServer();