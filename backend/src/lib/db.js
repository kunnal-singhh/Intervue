import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    if (!ENV.DB_URL) {
      throw new Error("Missing DB_URL in environment variables.");
    }

    // Reuse existing connection if already connected (1) or connecting (2)
    if (mongoose.connection.readyState >= 1) {
      return;
    }

    const conn = await mongoose.connect(ENV.DB_URL, {
      serverSelectionTimeoutMS: 10000, // 10s timeout for server selection
    });

    console.log("✅ Connected to MongoDB:", conn.connection.host);
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    if (error.name === "MongooseServerSelectionError") {
      console.error(
        "👉 Note: MongooseServerSelectionError usually means MongoDB Atlas IP Whitelist issue or invalid DB_URL connection string."
      );
    }
    throw error;
  }
};