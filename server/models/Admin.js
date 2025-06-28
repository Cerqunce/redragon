const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // This adds createdAt and updatedAt fields
  }
);

// Add soft delete functionality
adminSchema.methods.softDelete = function () {
  this.deletedAt = new Date();
  return this.save();
};

// Add query helper to exclude soft deleted documents
adminSchema.query.notDeleted = function () {
  return this.where({ deletedAt: null });
};

module.exports = mongoose.model("Admin", adminSchema);
