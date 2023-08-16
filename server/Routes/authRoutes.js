const authCountrollers = require("../Controllers/authCountrollers");
const express = require("express");
const multer = require("multer");
const path = require("path");

const authRoutes = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "./public/images/"); // './public/images/' directory name where save the file
  },
  filename: (req, file, callBack) => {
    callBack(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  dest: "/public/images",
});

authRoutes.post("/signin", upload.single("image"), authCountrollers.signin);
authRoutes.post("/login", authCountrollers.login);
authRoutes.get("/verifyToken", authCountrollers.verifyToken);
authRoutes.get("/verifyEmail", authCountrollers.verifyEmail);
authRoutes.get(
  "/logout",
  authCountrollers.verifyToken,
  authCountrollers.logout
);
authRoutes.post(
  "/forgot-password",
  authCountrollers.verifyToken,
  authCountrollers.forgotPassword
);

authRoutes.post(
  "/reset-password",
  authCountrollers.verifyToken,
  authCountrollers.resetPassword
);

module.exports = authRoutes;
