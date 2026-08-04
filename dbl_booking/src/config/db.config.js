import {config} from "./config.js"
import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    await mongoose.connect(config.MONGO_URI); 
    console.log("Database connected successfully");
  } catch (error) { 
    console.error("Database connection error:", error);
    process.exit(1); 
  }
};