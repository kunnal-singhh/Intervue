import { requireAuth, getAuth, clerkClient } from '@clerk/express'
import User from "../models/User.js"
import { upsertStreamUser } from "../lib/stream.js"

export const protectRoute = [
requireAuth(), 
async (req, res,next) => {
    try{
  // Use `getAuth()` to get the user's `userId`
  const { userId } = getAuth(req)

  if(!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  let user = await User.findOne({ clerkId:userId });
  
  if (!user) {
    // Attempt to auto-sync user if they are missing (e.g. if webhook failed)
    try {
      const clerkUser = await clerkClient.users.getUser(userId);
      const email = clerkUser.emailAddresses?.[0]?.emailAddress || "";
      const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "User";
      
      user = await User.create({
        clerkId: userId,
        email,
        name,
        profileImage: clerkUser.imageUrl
      });

      await upsertStreamUser({ 
        id: user.clerkId.toString(),
        name: user.name,
        image: user.profileImage,
      });
      console.log("✅ Auto-synced user in protectRoute:", user.clerkId);
    } catch (syncError) {
      console.error("Error auto-syncing user:", syncError);
      return res.status(404).json({ error: 'User not found' });
    }
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