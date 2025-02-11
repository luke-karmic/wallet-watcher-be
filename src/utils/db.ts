import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export async function connectToDatabase() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    return conn;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

export default connectToDatabase;
