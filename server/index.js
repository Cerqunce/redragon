const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const db = require("./config/database");
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
try {
  db.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.log("Unable to connect to the database:");
}

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
      file.mimetype == "image/jpeg" ||
      file.mimetype == "imapge/webp"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(
        false,
        false,
        new Error("Only .png, .jpg .jpeg and webp format allowed!")
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

app.get("/api/blogs/all", (req, res) => {
  db.models.Review.findAll()
    .then((blogs) => {
      res.json(blogs);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.post("/api/blogs/all", async (req, res) => {
  const { filter } = req.body;
  if (!filter) {
    return res.status(400).json({ msg: "No filter provided" });
  }
  try {
    const reviews = await db.models.Review.findAll({
      where: {
        type: filter,
      },
    });
    return res.status(200).json(reviews);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

app.post("/api/blogs/getreview", async (req, res) => {
  const { id } = req.body;
  if (!id) return res.json({ message: "id is required" });
  try {
    const review = await db.models.Review.findOne({ where: { id: id } });
    return res.json(review);
  } catch (error) {
    return res.json(error);
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
    const admin = await db.models.Admin.create({
      username,
      password: hashedPassword,
    });
    return res
      .status(200)
      .json({ msg: "Admin created", adminID: admin.id, status: true });
  } catch {
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
    const admin = await db.models.Admin.findOne({ where: { username } });
    if (!admin) {
      return res.status(400).json({ msg: "Admin not found", status: false });
    }

    const isMatch = await bycrypt.compare(password, admin.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ msg: "Invalid credentials", status: false });
    }
    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET);
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
    const admins = await db.models.Admin.findAll();
    return res.status(200).json(admins);
  } catch (err) {
    return res.status(500).json({ msg: "Server Error", status: false });
  }
});

app.post("/api/admin/delete", async (req, res) => {
  const { username } = req.body;
  try {
    const admin = await db.models.Admin.findOne({ where: { username } });
    if (!admin) {
      return res.status(400).json({ msg: "Admin not found", status: false });
    }
    await admin.destroy();
    return res.status(200).json({ msg: "Admin deleted", status: true });
  } catch {
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
    const admin = await db.models.Admin.findOne({ where: { username } });
    if (!admin) {
      return res.status(400).json({ msg: "Admin not found", status: false });
    }
    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(password, salt);
    await admin.update({ password: hashedPassword });
    return res.status(200).json({ msg: "Admin updated", status: true });
  } catch {
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
  if (!title || !content || !category || !image || !summary || !token) {
    return res
      .status(400)
      .json({ msg: "Please enter all fields", status: false });
  }
  try {
    const review = await db.models.Review.create({
      title,
      content,
      image,
      summary,
      type: category,
    });
    return res
      .status(200)
      .json({ msg: "review created", reviewID: review.id, status: true });
  } catch {
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
    const review = await db.models.Review.findOne({ where: { id } });
    if (!review) {
      return res.status(400).json({ msg: "Review not found", status: false });
    }
    await review.destroy();
    return res.status(200).json({ msg: "Review deleted", status: true });
  } catch {
    return res.status(500).json({ msg: "Server Error", status: false });
  }
});





app.listen(process.env.PORT, () => {
  console.log(`Listening at ${process.env.PORT}`);
});
