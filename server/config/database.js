const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    // Check if MONGODB_URI is properly configured
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('username:password')) {
      console.log("⚠️  MongoDB connection string not configured.");
      console.log("📝 Please update your .env file with a valid MongoDB Atlas connection string.");
      console.log("🔗 Get your connection string from: https://cloud.mongodb.com/");
      return;
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Atlas connected successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to MongoDB:", error.message);
    console.log("📝 Please check your MongoDB Atlas connection string in the .env file.");
    console.log("🔗 Troubleshooting: https://docs.mongodb.com/manual/reference/connection-string/");
  }
};

module.exports = connectDB;
