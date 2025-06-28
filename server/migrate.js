const mongoose = require("mongoose");
const { Sequelize } = require("sequelize");
require("dotenv").config();

// Import your new MongoDB models
const Review = require("./models/Review");
const Admin = require("./models/Admin");

// Setup old PostgreSQL connection (you'll need to temporarily add sequelize back for migration)
// const sequelize = new Sequelize(process.env.OLD_DB_URI || process.env.DB_URI);

const migrateData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB Atlas");

    // Connect to PostgreSQL (uncomment if you have existing data to migrate)
    // await sequelize.authenticate();
    // console.log("Connected to PostgreSQL");

    // Migrate Reviews
    console.log("Starting Reviews migration...");
    
    // Uncomment and modify this section if you have existing data
    /*
    const oldReviews = await sequelize.query("SELECT * FROM \"Reviews\" WHERE \"deletedAt\" IS NULL", {
      type: Sequelize.QueryTypes.SELECT
    });

    for (const oldReview of oldReviews) {
      const newReview = new Review({
        title: oldReview.title,
        content: oldReview.content,
        summary: oldReview.summary,
        type: oldReview.type,
        image: oldReview.image,
        createdAt: oldReview.createdAt,
        updatedAt: oldReview.updatedAt,
      });
      await newReview.save();
      console.log(`Migrated review: ${oldReview.title}`);
    }
    */

    // Migrate Admins
    console.log("Starting Admins migration...");
    
    // Uncomment and modify this section if you have existing data
    /*
    const oldAdmins = await sequelize.query("SELECT * FROM \"Admins\" WHERE \"deletedAt\" IS NULL", {
      type: Sequelize.QueryTypes.SELECT
    });

    for (const oldAdmin of oldAdmins) {
      const newAdmin = new Admin({
        username: oldAdmin.username,
        password: oldAdmin.password, // Already hashed
        createdAt: oldAdmin.createdAt,
        updatedAt: oldAdmin.updatedAt,
      });
      await newAdmin.save();
      console.log(`Migrated admin: ${oldAdmin.username}`);
    }
    */

    console.log("Migration completed successfully!");
    
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await mongoose.connection.close();
    // await sequelize.close();
    process.exit();
  }
};

// Run migration
migrateData();
