const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const connectDB = require("./config/database");
const Review = require("./models/Review");
const Admin = require("./models/Admin");
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
  const { id } = req.body;
  console.log("Get review request - ID received:", id, "Type:", typeof id);
  
  if (!id) {
    console.log("No ID provided in request body:", req.body);
    return res.status(400).json({ message: "id is required" });
  }
  
  try {
    const review = await Review.findById(id);
    if (!review || review.deletedAt) {
      return res.status(404).json({ message: "Review not found" });
    }
    console.log("Review found successfully:", review._id);
    
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
