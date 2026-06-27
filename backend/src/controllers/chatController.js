import { chatClient } from "../lib/stream.js";

export async function getStreamToken(req, res) { 
try{ 
    const token=chatClient.createToken(req.user.clerkId); //req.user is attached by protectRoute middleware and contains the user object from the database
    res.status(200).json({ 
        token,
        userId:req.user.clerkId,
        userName:req.user.name,
        userImage:req.user.image
    });
} catch (error) {
    console.error("Error generating Stream token:", error);
    res.status(500).json({ error: "Failed to generate Stream token" });
}

}