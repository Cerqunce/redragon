const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const db = require("./config/database");
const cors = require("cors");

// Middleware
app.use(morgan("tiny"));
require("dotenv").config();
app.use(bodyParser.json());

// var whitelist = ["http://localhost:3000/", "https://reddragon.vercel.app/"];
// var whitelist = ["http://localhost:3000/", "https://reddragon.vercel.app/"];
var corsOptions = {
  credentials: true,
  // origin: function (origin, callback) {
  //   console.log(origin);
  //   if (whitelist.indexOf(origin) !== -1 || !origin) {
  //     callback(null, true);
  //   } else {
  //     callback(new Error("Not allowed by CORS"));
  //   }
  // },
  origin: "*",
};

app.use(cors(corsOptions));

//Database Setup
try {
  db.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.log("Unable to connect to the database:");
}


// Routes
app.get("/api/blogs/all", (req, res) => {
  db.models.Blog.findAll()
    .then((blogs) => {
      res.json(blogs);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.post("/api/blogs/create", (req, res) => {
  const { html, draft } = req.body;
  db.models.Blog.create({
    html,
    draft,
  })
    .then((blog) => {
      res.json(blog);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.listen(process.env.PORT, () => {
  console.log(`Listening at http://localhost:${process.env.PORT}`);
});
