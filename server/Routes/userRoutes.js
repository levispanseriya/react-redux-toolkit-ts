const userCountrollers = require("../Controllers/userControllers");
const authCountrollers = require("../Controllers/authCountrollers");

const express = require("express");
const multer = require("multer");
const path = require("path");
const Joi = require("joi");

const userRoutes = express.Router();

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

userRoutes.post(
  "/createuser",
  authCountrollers.verifyToken,
  upload.single("image"),
  userCountrollers.createUser
);

userRoutes.patch(
  "/updateUser/:userid",
  authCountrollers.verifyToken,
  upload.single("image"),
  userCountrollers.updateUser
);

userRoutes.get(
  "/getUser",
  authCountrollers.verifyToken,
  userCountrollers.getAllUser
);
userRoutes.get(
  "/getUser/:id",
  authCountrollers.verifyToken,
  userCountrollers.getUser
);

userRoutes.get(
  "/deleteUser/:id",
  authCountrollers.verifyToken,
  userCountrollers.deleteUser
);

module.exports = userRoutes;
