// const userCountrollers = require("../Controllers/userControllers");
const express = require("express");
const authCountrollers = require("../Controllers/authCountrollers");
const bookCountrollers = require("../Controllers/bookControllers");

// const path = require("path");
// const Joi = require("joi");

const bookRoutes = express.Router();

bookRoutes.post(
  "/addBook",
  authCountrollers.verifyToken,
  bookCountrollers.addBook
);

bookRoutes.post(
  "/borrow/:bookId",
  authCountrollers.verifyToken,
  bookCountrollers.borrowBook
);

bookRoutes.get(
  "/getBook",
  authCountrollers.verifyToken,
  bookCountrollers.getAllBook
);

// bookRoutes.get(
//   "/availableBook",
//   authCountrollers.verifyToken,
//   bookCountrollers.availableBook
// );

// bookRoutes.get(
//   "/getBook/:bookId",
//   authCountrollers.verifyToken,
//   bookCountrollers.getBookById
// );

bookRoutes.get(
  "/search/:searchType/:searchParam",
  authCountrollers.verifyToken,
  bookCountrollers.search
);

// bookRoutes.get(
//   "/getBook/:bookname",
//   authCountrollers.verifyToken,
//   bookCountrollers.getBookByName
// );

bookRoutes.get(
  "/returnBook/:bookId",
  authCountrollers.verifyToken,
  bookCountrollers.returnBook
);
// bookRoutes.get(
//   "/filterByDate",
//   authCountrollers.verifyToken,
//   bookCountrollers.filterByDate
// );

// bookRoutes.get(
//   "/WhoOwnBook/:bookId",
//   authCountrollers.verifyToken,
//   bookCountrollers.WhoOwnBook
// );

// bookRoutes.get(
//   "/HowmanyBookOwn/:userId",
//   authCountrollers.verifyToken,
//   bookCountrollers.HowmanyBookOwn
// );

bookRoutes.get(
  "/globalSearch",
  authCountrollers.verifyToken,
  bookCountrollers.globalSearch
);

bookRoutes.get("/deleteBook/:id", authCountrollers.verifyToken);

module.exports = bookRoutes;
