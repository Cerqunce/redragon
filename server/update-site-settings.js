const mongoose = require('mongoose');
const connectDB = require('./config/database');

async function updateSiteSettings() {
  try {
    // Connect to database
    await connectDB();
    
    const SiteSettings = require('./models/SiteSettings');
    
    // Update existing settings
    const result = await SiteSettings.updateOne(
      { isActive: true },
      { 
        heroImage: "assets/img/wallpaper.jpg"
      }
    );
    
    console.log('Site settings updated:', result);
    
    // Fetch and display updated settings
    const updatedSettings = await SiteSettings.findOne({ isActive: true });
    console.log('Updated site settings:', updatedSettings);

  } catch (error) {
    console.error('Error updating site settings:', error);
  } finally {
    mongoose.connection.close();
  }
}

updateSiteSettings();
