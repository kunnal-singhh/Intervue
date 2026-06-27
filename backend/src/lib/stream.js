import {StreamChat} from 'stream-chat';
import {StreamClient} from '@stream-io/node-sdk';
import {ENV} from './env.js';

const apiKey=ENV.STREAM_API_KEY;
const apiSecret=ENV.STREAM_API_SECRET;

if(!apiKey || !apiSecret){
    console.error("STREAM_API_KEY or STREAM_API_SECRET is missing");
}

// here chatClient is a singleton instance of StreamChat that can be used throughout the application to interact with the Stream Chat API.
export const chatClient=StreamChat.getInstance(apiKey,apiSecret);

//this is for video call functionality
export const streamClient=new StreamClient(apiKey,apiSecret);

export const upsertStreamUser=async(userData)=>{
    try {
        await chatClient.upsertUser(userData)
        console.log("Stream user upserted:", userData.id);
        return userData;
    } catch (error) {
        console.error("Error upserting user to Stream:", error);
        throw error;
    }
} 

export const deleteStreamUser=async(userId)=>{ 
    try {
        await chatClient.deleteUser(userId);
        console.log("Stream user deleted:", userId);
    } catch (error) {
        console.error("Error deleting user from Stream:", error);
        throw error;
    }
}
