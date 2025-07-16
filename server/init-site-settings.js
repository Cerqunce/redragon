const mongoose = require('mongoose');
const connectDB = require('./config/database');

async function initializeSiteSettings() {
  try {
    // Connect to database
    await connectDB();
    
    const SiteSettings = require('./models/SiteSettings');
    
    // Check if settings already exist
    const existingSettings = await SiteSettings.findOne({ isActive: true });
    
    if (existingSettings) {
      console.log('Site settings already exist:', existingSettings);
      return;
    }

    // Create default settings
    const defaultSettings = new SiteSettings({
      title: "Redragon Reviews",
      subtitle: "Your trusted source for gaming gear reviews",
      heroImage: "assets/img/wallpaper.jpg",
      isActive: true
    });

    await defaultSettings.save();
    console.log('Default site settings created successfully:', defaultSettings);

  } catch (error) {
    console.error('Error initializing site settings:', error);
  } finally {
    mongoose.connection.close();
  }
}

initializeSiteSettings();
