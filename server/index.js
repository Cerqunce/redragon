const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const db = require("./config/database");

// Middleware
app.use(morgan("tiny"));
require("dotenv").config();
app.use(bodyParser.json());

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
