const mongoose = require("mongoose");
require("dotenv").config();

const testConnection = async () => {
  try {
    console.log("Testing MongoDB Atlas connection...");
    
    if (!process.env.MONGODB_URI) {
      console.error("❌ MONGODB_URI not found in environment variables");
      console.log("Please create a .env file and add your MongoDB Atlas connection string");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ Successfully connected to MongoDB Atlas!");
    console.log("Database:", mongoose.connection.name);
    console.log("Host:", mongoose.connection.host);
    
    // Test creating a simple document
    const testSchema = new mongoose.Schema({ test: String });
    const TestModel = mongoose.model('Test', testSchema);
    
    const testDoc = new TestModel({ test: 'Connection test' });
    await testDoc.save();
    console.log("✅ Successfully created test document");
    
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log("✅ Successfully deleted test document");
    
    console.log("\n🎉 MongoDB Atlas is ready to use!");
    
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB Atlas:");
    
    if (error.message.includes('authentication failed')) {
      console.error("Authentication failed. Please check your username and password in the connection string.");
    } else if (error.message.includes('network')) {
      console.error("Network error. Please check your network access settings in MongoDB Atlas.");
    } else {
      console.error(error.message);
    }
    
    console.log("\nTroubleshooting tips:");
    console.log("1. Check your MONGODB_URI in the .env file");
    console.log("2. Verify your MongoDB Atlas username and password");
    console.log("3. Ensure your IP address is whitelisted in MongoDB Atlas Network Access");
    console.log("4. Make sure your cluster is running");
    
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

testConnection();
