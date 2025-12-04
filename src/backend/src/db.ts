import mongoose from "mongoose";

const MONGO_URI =
  "mongodb+srv://admin:password12345@cluster0.mongodb.net/spotify-recap";

export async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}