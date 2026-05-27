import express from "express";
import {ENV} from "./lib/env.js" //local file i.e. why we use .js extension
const app=express();
console.log(ENV.PORT)
console.log(ENV.DB_URL)
app.get("/",(req,res)=>{ 
    res.status(200).json({msg:"success from api"})
})

app.listen(ENV.PORT,()=> console.log("server is running on port",ENV.PORT))