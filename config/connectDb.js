const mongoose = require("mongoose");
require("dotenv").config(); // Ensure environment variables are loaded

const connectDb = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    console.log("MONGO_URL:", process.env.MONGO_URL); // Debugging Log

    if (!process.env.MONGO_URL) {
      throw new Error("MongoDB URL is missing! Check .env file.");
    }

    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

module.exports = connectDb;
