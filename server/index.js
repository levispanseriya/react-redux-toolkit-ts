const express = require("express");
require("./Models/index");
const cors = require("cors");
const db = require("./config/db.config");
const path = require("path");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authRoutes = require("./Routes/authRoutes");
const userRoutes = require("./Routes/userRoutes");
const bookRoutes = require("./Routes/bookRoutes");

const PORT = 8080;

const corsOptions = {
  origin: "http://localhost:8080",
};

const app = express();

// middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// API
app.get("/", (req, res) => {
  res.json({ message: "Welcome To My App Server" });
});
app.use("/api/auth/", authRoutes);
app.use("/user/", userRoutes);
app.use("/book/", bookRoutes);

// Reset Pass

app.listen(PORT, () => {
  console.log(`Server is Running On ${PORT}`);
});
