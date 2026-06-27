import { requireAuth, getAuth } from '@clerk/express'
import User from "../models/User.js"

export const protectRoute = [
requireAuth(), 
async (req, res,next) => {
    try{
  // Use `getAuth()` to get the user's `userId`
  const { userId } = getAuth(req)

  if(!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = await User.findOne({ clerkId:userId });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Attach the user object to the request for use in subsequent middleware or route handlers
  req.user = user;
  next(); // Call next() to proceed to the next middleware or route handler
 

}

catch(error){
    console.error("Error in protectRoute middleware:", error);
    return res.status(500).json({ error: 'Internal server error' });
}
}
]