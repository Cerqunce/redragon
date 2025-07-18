const mongoose = require("mongoose");

// Function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: false,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true, // Allow null values but ensure uniqueness when present
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

// Pre-save middleware to generate slug
reviewSchema.pre('save', async function(next) {
  if (this.isModified('title') && this.title) {
    let baseSlug = generateSlug(this.title);
    let slug = baseSlug;
    let counter = 1;
    
    // Check for existing slugs and append number if needed
    while (await this.constructor.findOne({ slug, deletedAt: null, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.slug = slug;
  }
  next();
});

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
