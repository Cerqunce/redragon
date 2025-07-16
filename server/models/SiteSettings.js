const mongoose = require("mongoose");

const siteSettingsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: "Redragon Reviews"
    },
    subtitle: {
      type: String,
      required: true,
      default: "Your trusted source for gaming gear reviews"
    },
    heroImage: {
      type: String,
      required: false,
      default: "assets/img/wallpaper.jpg"
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
  }
);

// Ensure only one active site settings document exists
siteSettingsSchema.index({ isActive: 1 }, { unique: true, partialFilterExpression: { isActive: true } });

module.exports = mongoose.model("SiteSettings", siteSettingsSchema);
