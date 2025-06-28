const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: false,
    },
    content: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
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
reviewSchema.methods.softDelete = function () {
  this.deletedAt = new Date();
  return this.save();
};

// Add query helper to exclude soft deleted documents
reviewSchema.query.notDeleted = function () {
  return this.where({ deletedAt: null });
};

module.exports = mongoose.model("Review", reviewSchema);
