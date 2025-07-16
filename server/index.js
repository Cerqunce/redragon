const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const connectDB = require("./config/database");
const Review = require("./models/Review");
const Admin = require("./models/Admin");
const SiteSettings = require("./models/SiteSettings");
const cors = require("cors");
const bycrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

// Middleware
app.use(morgan("tiny"));
require("dotenv").config();
app.use(bodyParser.json());
app.use(cookieParser());

var whitelist = [
  "http://127.0.0.1:3000",
  "http://localhost:3000",
  "https://reddragon.vercel.app",
  "http://redragonreviews.com",
  "https://www.redragonreviews.com"
];
var corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    console.log(origin);
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

//Database Setup
connectDB();

const multer = require("multer");
const STORAGE = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({
  storage: STORAGE,

  fileFilter: (req, file, cb) => {
    console.log("mimetype: ", file.mimetype);
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(
        false,
        false,
        new Error("Only .png, .jpg and .jpeg format allowed!")
      );
    }
  },
});

const verifyToken = (req, res, next) => {
  const token = req.body.token;
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    decoded ? (req.admin = true) : (req.admin = false);
    next();
  } catch (error) {
    res.status(400).json({ msg: "Token is not valid" });
  }
};

// Routes

app.use("/api/uploads", express.static("uploads"));

// Site Settings Routes
app.get("/api/settings", async (req, res) => {
  try {
    let settings = await SiteSettings.findOne({ isActive: true });
    
    // If no settings exist, create default ones
    if (!settings) {
      settings = new SiteSettings({
        title: "Redragon Reviews",
        subtitle: "Your trusted source for gaming gear reviews",
        heroImage: "assets/img/wallpaper.jpg",
        isActive: true
      });
      await settings.save();
    }
    
    res.status(200).json(settings);
  } catch (error) {
    console.error("Error fetching site settings:", error);
    res.status(500).json({ error: "Failed to fetch site settings" });
  }
});

app.post("/api/settings/update", verifyToken, async (req, res) => {
  try {
    const { title, subtitle, heroImage } = req.body;
    
    let settings = await SiteSettings.findOne({ isActive: true });
    
    if (!settings) {
      settings = new SiteSettings({
        title,
        subtitle,
        heroImage,
        isActive: true
      });
    } else {
      settings.title = title;
      settings.subtitle = subtitle;
      settings.heroImage = heroImage;
    }
    
    await settings.save();
    res.status(200).json({ message: "Site settings updated successfully", settings });
  } catch (error) {
    console.error("Error updating site settings:", error);
    res.status(500).json({ error: "Failed to update site settings" });
  }
});

app.get("/api/blogs/all", async (req, res) => {
  try {
    const blogs = await Review.find({ deletedAt: null });
    // Add virtual id field for frontend compatibility
    const blogsWithId = blogs.map(blog => ({
      ...blog.toObject(),
      id: blog._id
    }));
    res.json(blogsWithId);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/blogs/all", async (req, res) => {
  const { filter } = req.body;
  if (!filter) {
    return res.status(400).json({ msg: "No filter provided" });
  }
  try {
    const reviews = await Review.find({
      type: filter,
      deletedAt: null,
    });
    // Add virtual id field for frontend compatibility
    const reviewsWithId = reviews.map(review => ({
      ...review.toObject(),
      id: review._id
    }));
    return res.status(200).json(reviewsWithId);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

app.post("/api/blogs/getreview", async (req, res) => {
  const { id, slug } = req.body;
  console.log("Get review request - ID received:", id, "Slug received:", slug, "Types:", typeof id, typeof slug);
  
  if (!id && !slug) {
    console.log("No ID or slug provided in request body:", req.body);
    return res.status(400).json({ message: "id or slug is required" });
  }
  
  try {
    let review;
    
    if (slug) {
      // Try to find by slug first
      review = await Review.findOne({ slug, deletedAt: null });
      console.log("Searching by slug:", slug);
    } else {
      // Fall back to ID search for backward compatibility
      review = await Review.findById(id);
      console.log("Searching by ID:", id);
    }
    
    if (!review || review.deletedAt) {
      return res.status(404).json({ message: "Review not found" });
    }
    console.log("Review found successfully:", review._id, "with slug:", review.slug);
    
    // Add virtual id field for frontend compatibility
    const reviewWithId = {
      ...review.toObject(),
      id: review._id
    };
    
    return res.json(reviewWithId);
  } catch (error) {
    console.error("Error fetching review:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

// New endpoint specifically for slug-based retrieval (GET method for SEO)
app.get("/api/blogs/review/:slug", async (req, res) => {
  const { slug } = req.params;
  console.log("Get review by slug - Slug received:", slug);
  
  if (!slug) {
    return res.status(400).json({ message: "slug is required" });
  }
  
  try {
    const review = await Review.findOne({ slug, deletedAt: null });
    
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    console.log("Review found by slug:", review._id, "with slug:", review.slug);
    
    // Add virtual id field for frontend compatibility
    const reviewWithId = {
      ...review.toObject(),
      id: review._id
    };
    
    return res.json(reviewWithId);
  } catch (error) {
    console.error("Error fetching review by slug:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/add", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ msg: "Please enter all fields", status: false });
  }
  try {
    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(password, salt);
    const admin = new Admin({
      username,
      password: hashedPassword,
    });
    await admin.save();
    return res
      .status(200)
      .json({ msg: "Admin created", adminID: admin._id, status: true });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ msg: "Username already exists", status: false });
    }
    return res.status(500).json({ msg: "Server Error", status: false });
  }
});

app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ msg: "Please enter all fields", status: false });
  }
  try {
    const admin = await Admin.findOne({ username, deletedAt: null });
    if (!admin) {
      return res.status(400).json({ msg: "Admin not found", status: false });
    }

    const isMatch = await bycrypt.compare(password, admin.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ msg: "Invalid credentials", status: false });
    }
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
    res.cookie("token", token, {
      sameSite: "none",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return res.status(200).json({ msg: "Logged in", status: true, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error", status: false });
  }
});

app.post("/api/admin/verify", (req, res) => {
  const token = req.body.token;
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }
    return res.status(200).json({ msg: "Token is valid", status: true });
  } catch (error) {
    return res.status(500).json({ msg: "Server Error", status: false });
  }
});

app.get("/api/admin/alladmins", async (req, res) => {
  try {
    const admins = await Admin.find({ deletedAt: null }).select('-password');
    return res.status(200).json(admins);
  } catch (err) {
    return res.status(500).json({ msg: "Server Error", status: false });
  }
});

app.post("/api/admin/delete", async (req, res) => {
  const { username } = req.body;
  try {
    const admin = await Admin.findOne({ username, deletedAt: null });
    if (!admin) {
      return res.status(400).json({ msg: "Admin not found", status: false });
    }
    await admin.softDelete();
    return res.status(200).json({ msg: "Admin deleted", status: true });
  } catch (error) {
    return res.status(500).json({ msg: "Server Error", status: false });
  }
});

app.post("/api/admin/update", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ msg: "Please enter all fields", status: false });
  }
  try {
    const admin = await Admin.findOne({ username, deletedAt: null });
    if (!admin) {
      return res.status(400).json({ msg: "Admin not found", status: false });
    }
    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(password, salt);
    admin.password = hashedPassword;
    await admin.save();
    return res.status(200).json({ msg: "Admin updated", status: true });
  } catch (error) {
    return res.status(500).json({ msg: "Server Error", status: false });
  }
});

app.post("/api/blogs/upload", upload.single("image"), (req, res) => {
  console.log(req.file);
  return res.send(req.file);
});

// New endpoint for uploading images within review content
app.post("/api/blogs/upload-content-image", upload.single("upload"), (req, res) => {
  try {
    console.log("Content image upload:", req.file);
    
    if (!req.file) {
      return res.status(400).json({
        error: {
          message: "No file uploaded"
        }
      });
    }

    // CKEditor expects this specific response format
    const response = {
      url: `${req.protocol}://${req.get('host')}/api/uploads/${req.file.filename}`
    };

    console.log("Content image upload response:", response);
    return res.json(response);
  } catch (error) {
    console.error("Content image upload error:", error);
    return res.status(500).json({
      error: {
        message: "Upload failed"
      }
    });
  }
});

// Endpoint to get all uploaded images for gallery
app.get("/api/admin/images", async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const uploadsDir = path.join(__dirname, 'uploads');
    
    if (!fs.existsSync(uploadsDir)) {
      return res.json([]);
    }
    
    const files = fs.readdirSync(uploadsDir);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    });
    
    const images = imageFiles.map((filename, index) => {
      const filePath = path.join(uploadsDir, filename);
      const stats = fs.statSync(filePath);
      
      return {
        id: index,
        filename,
        originalname: filename,
        size: stats.size,
        uploadDate: stats.birthtime,
        url: `/api/uploads/${filename}`
      };
    });
    
    // Sort by upload date, newest first
    images.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    
    return res.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    return res.status(500).json({ error: "Failed to fetch images" });
  }
});

// Endpoint to delete an image
app.delete("/api/admin/images/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const fs = require('fs');
    const path = require('path');
    const uploadsDir = path.join(__dirname, 'uploads');
    
    const files = fs.readdirSync(uploadsDir);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    });
    
    if (id >= 0 && id < imageFiles.length) {
      const filename = imageFiles[id];
      const filePath = path.join(uploadsDir, filename);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return res.json({ message: "Image deleted successfully" });
      }
    }
    
    return res.status(404).json({ error: "Image not found" });
  } catch (error) {
    console.error("Error deleting image:", error);
    return res.status(500).json({ error: "Failed to delete image" });
  }
});

app.use(verifyToken);
app.post("/api/blogs/create", async (req, res) => {
  const { title, content, category, image, summary, token } = req.body;
  
  // Debug logging
  console.log("Blog creation request body:", req.body);
  console.log("Fields received:", { title: !!title, content: !!content, category: !!category, image: !!image, summary: !!summary, token: !!token });
  
  if (!title || !content || !category || !image || !summary || !token) {
    const missingFields = [];
    if (!title) missingFields.push('title');
    if (!content) missingFields.push('content');
    if (!category) missingFields.push('category');
    if (!image) missingFields.push('image');
    if (!summary) missingFields.push('summary');
    if (!token) missingFields.push('token');
    
    console.log("Missing fields:", missingFields);
    return res
      .status(400)
      .json({ msg: `Missing required fields: ${missingFields.join(', ')}`, status: false });
  }
  
  try {
    const review = new Review({
      title,
      content,
      image,
      summary,
      type: category,
    });
    await review.save();
    console.log("Review created successfully:", review._id);
    return res
      .status(200)
      .json({ msg: "review created", reviewID: review._id, status: true });
  } catch (error) {
    console.error("Error creating review:", error);
    return res.status(500).json({ msg: "Server Error", status: false });
  }
});

app.post("/api/blogs/update", async (req, res) => {
  const { id, title, content, category, image, summary, token } = req.body;
  const { admin } = req;
  
  // Debug logging
  console.log("Blog update request body:", req.body);
  console.log("Fields received:", { id: !!id, title: !!title, content: !!content, category: !!category, image: !!image, summary: !!summary, token: !!token });
  
  if (!id || !title || !content || !category || !summary || !token || !admin) {
    const missingFields = [];
    if (!id) missingFields.push('id');
    if (!title) missingFields.push('title');
    if (!content) missingFields.push('content');
    if (!category) missingFields.push('category');
    if (!summary) missingFields.push('summary');
    if (!token) missingFields.push('token');
    if (!admin) missingFields.push('admin verification');
    
    console.log("Missing fields for update:", missingFields);
    return res
      .status(400)
      .json({ msg: `Missing required fields: ${missingFields.join(', ')}`, status: false });
  }
  
  try {
    const review = await Review.findById(id);
    if (!review || review.deletedAt) {
      return res.status(400).json({ msg: "Review not found", status: false });
    }
    
    // Update fields
    review.title = title;
    review.content = content;
    review.summary = summary;
    review.type = category;
    if (image) {
      review.image = image;
    }
    
    await review.save();
    console.log("Review updated successfully:", review._id);
    return res
      .status(200)
      .json({ msg: "review updated", reviewID: review._id, status: true });
  } catch (error) {
    console.error("Error updating review:", error);
    return res.status(500).json({ msg: "Server Error", status: false });
  }
});

app.post("/api/blogs/delete/", async (req, res) => {
  const { id } = req.body;
  const { admin } = req;
  if (!id || !admin) {
    return res
      .status(400)
      .json({ msg: "Please enter all fields", status: false });
  }
  try {
    const review = await Review.findById(id);
    if (!review || review.deletedAt) {
      return res.status(400).json({ msg: "Review not found", status: false });
    }
    await review.softDelete();
    return res.status(200).json({ msg: "Review deleted", status: true });
  } catch (error) {
    return res.status(500).json({ msg: "Server Error", status: false });
  }
});




app.listen(process.env.PORT, () => {
  console.log(`Listening at ${process.env.PORT}`);
});
