const mongoose = require("mongoose");
const Review = require("./models/Review");
require("dotenv").config();

// Function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

async function addSlugsToExistingReviews() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Find all reviews without slugs
    const reviews = await Review.find({ 
      deletedAt: null,
      $or: [
        { slug: { $exists: false } },
        { slug: null },
        { slug: "" }
      ]
    });

    console.log(`Found ${reviews.length} reviews without slugs`);

    for (const review of reviews) {
      if (review.title) {
        let baseSlug = generateSlug(review.title);
        let slug = baseSlug;
        let counter = 1;
        
        // Check for existing slugs and append number if needed
        while (await Review.findOne({ slug, deletedAt: null, _id: { $ne: review._id } })) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }
        
        review.slug = slug;
        await review.save();
        console.log(`Added slug "${slug}" to review: ${review.title}`);
      } else {
        console.log(`Skipping review without title: ${review._id}`);
      }
    }

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the migration
addSlugsToExistingReviews();
