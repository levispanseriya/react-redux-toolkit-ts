const Joi = require("joi");
const { Op } = require("sequelize");

require("../Models/index");
Book = db.book;
User = db.user;
BorrowedBook = db.borrowedBook;

const addBook = async (req, res) => {
  const addBookSchema = Joi.object({
    bookname: Joi.string().min(3).max(25),
  });
  const { bookname } = await addBookSchema.validateAsync(req.body);
  console.log(bookname);

  const book = await Book.findOne({
    where: { bookname: bookname },
  });

  if (book) {
    return res.status(401).json({ message: "book Already Exist" });
  }

  const addbook = await Book.create({
    bookname: bookname,
  });

  res.status(201).json({ message: "Book Create SucessFully.", addBook });
};

const borrowBook = async (req, res) => {
  const userId = req.userData.user.dataValues.userid;
  const bookId = req.params.bookId;

  const borrowDate = new Date();
  const returnDate = new Date(borrowDate);
  returnDate.setDate(borrowDate.getDate() + 10);

  const isBookAvailable = await Book.findOne({
    where: { bookId: bookId },
  });

  if (!isBookAvailable) {
    return res.status(404).json({ message: "Book Not Listed" });
  }
  if (!isBookAvailable.isAvalilable) {
    return res
      .status(404)
      .json({ message: "Sorry Book Not Availble Right Now." });
  }

  console.log(isBookAvailable.isAvalilable, "isBookAvailableisBookAvailable");

  await Book.update(
    {
      isAvalilable: false,
      borrowDate: borrowDate,
      returnDate: returnDate,
      userId: userId,
    },
    {
      where: { bookId: bookId },
    }
  );

  return res.status(201).json({ message: "Book borrowed successfully" });
};

const getAllBook = async (req, res) => {
  console.log(getAllBook);
  const page = req.query.page || 1;
  const itemsPerPage = 2;
  const { count, rows: allBooks } = await Book.findAndCountAll({
    limit: itemsPerPage,
    offset: (page - 1) * itemsPerPage,
  });

  if (allBooks.length > 0) {
    const books = allBooks.map((book) => {
      return {
        bookId: book.bookId,
        bookname: book.bookname,
        isAvalilable: book.isAvalilable,
      };
    });

    res.status(200).json({ books, totalItems: count, currentPage: page });
  } else {
    res.status(404).json({ message: "No books found for this user" });
  }
};

const globalSearch = async (req, res) => {
  const globalSearchValidationSchema = Joi.object({
    bookId: Joi.number().integer().positive(),
    query: Joi.string().optional(),
    userId: Joi.number().integer().positive(),
    bookname: Joi.string().optional(),
    isAvalilable: Joi.boolean().optional(),
    filterBy: Joi.string().valid("borrowDate", "returnDate").optional(),
    fromDate: Joi.date().iso().optional(),
    toDate: Joi.date().iso().optional(),
    page: Joi.number().integer().positive().optional(),
  });
  const { value, error } = globalSearchValidationSchema.validate(req.query);

  const {
    bookId,
    query,
    userId,
    bookname,
    isAvalilable,
    filterBy,
    fromDate,
    toDate,
  } = value;

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const page = req.query.page || 1;
  const itemsPerPage = 5;

  try {
    const searchConditions = [];
    if (bookId) {
      searchConditions.push({ bookId: bookId });
    }
    if (userId) {
      searchConditions.push({ userId: userId });
    }
    if (bookname) {
      searchConditions.push({ bookname: { [Op.like]: `%${bookname}%` } });
    }
    if (isAvalilable) {
      searchConditions.push({ isAvalilable: isAvalilable });
    }
    if (filterBy && fromDate && toDate) {
      const filterCondition = {};
      filterCondition[filterBy] = {
        [Op.between]: [fromDate, toDate],
      };
      searchConditions.push(filterCondition);
    }
    console.log(searchConditions, "searchConditions");

    const { count, rows: searchResult } = await Book.findAndCountAll({
      where: {
        [Op.or]: searchConditions,
      },
      include: [
        {
          model: User,
          attributes: ["userid", "firstname", "lastname"],
        },
      ],
      limit: itemsPerPage,
      offset: (page - 1) * itemsPerPage,
    });

    if (searchResult.length > 0) {
      const books = searchResult.map((e) => {
        const userFullName =
          e.User && e.User.firstname && e.User.lastname
            ? `${e.User.firstname} ${e.User.lastname}`
            : "Not Owned By Anyone";
        return {
          bookId: e.bookId,
          userId: e.UserId,
          fullname: userFullName,
          bookname: e.bookname,
          isAvalilable: e.isAvalilable,
          borrowDate: e.borrowDate,
          returnDate: e.returnDate,
        };
      });

      res.status(200).json({
        books,
        totalItems: count,
        currentPage: page,
      });
    } else {
      res.status(404).json({ message: "No books found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};

const WhoOwnBook = async (req, res) => {
  console.log("WhoOwnBook");
  const bookid = req.params.bookId;
  const book = await Book.findOne({
    where: { bookId: bookid },
    include: [
      {
        model: User,
        attributes: ["userid", "firstname", "lastname"],
      },
    ],
  });
  if (book) {
    const owner = book.User; // Access the associated user
    console.log(owner);
    const userid = owner.userid;
    const fullname = `${owner.firstname} ${owner.lastname}`;
    res.status(200).json({ userid, fullname });
  } else {
    res.status(404).json({ message: "Book not found or not borrowed" });
  }
};

const HowmanyBookOwn = async (req, res) => {
  console.log("WhoOwnBook");
  const userId = req.params.userId;
  const borrowedBooks = await Book.findAll({
    where: { userId },
    include: [],
  });

  if (borrowedBooks.length > 0) {
    const books = borrowedBooks.map((borrowedBook) => borrowedBook.Book);
    res.status(200).json({ books });
  } else {
    res.status(404).json({ message: "No books found for this user" });
  }
};

const availableBook = async (req, res) => {
  const page = req.query.page || 1;
  const itemsPerPage = 2;
  const { count, rows: allBooks } = await Book.findAndCountAll({
    where: {
      isAvalilable: true,
    },
    limit: itemsPerPage,
    offset: (page - 1) * itemsPerPage,
  });

  if (allBooks.length > 0) {
    const books = allBooks.map((book) => {
      return {
        bookId: book.bookId,
        bookname: book.bookname,
        isAvalilable: book.isAvalilable,
      };
    });

    res.status(200).json({ books, totalItems: count, currentPage: page });
  } else {
    res.status(404).json({ message: "No Books Found. " });
  }
};

const getBookById = async (bookId) => {
  const book = await Book.findOne({
    where: { bookId },
  });
  return book;
};

const getBookByName = async (bookName) => {
  console.log("getBookByName");
  const books = await Book.findAll({
    where: {
      bookname: {
        [Op.like]: `%${bookName}%`,
      },
    },
  });

  console.log("HEllo");

  return books;
};

const search = async (req, res) => {
  const { searchType, searchParam } = req.params;
  console.log("search");
  try {
    let book;
    if (searchType === "id") {
      book = await getBookById(searchParam);
    } else if (searchType === "name") {
      book = await getBookByName(searchParam);
    } else {
      res.status(400).json({ message: "Invalid search type" });
      return;
    }

    if (book) {
      console.log("HEllo2");

      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};

const returnBook = async (req, res) => {
  console.log("returnBook");
  const bookid = req.params.bookId;

  const rBook = await Book.findOne({ where: { bookId: bookid } });

  if (rBook.isAvalilable) {
    res.status(400).json({ message: "Book already Submitted!!!" });
  } else {
    const updatedBooks = await Book.update(
      { isAvalilable: true, userId: null },
      {
        returning: true,
        where: {
          bookId: bookid,
        },
      }
    );

    res.status(200).json({
      message: "Book returned successfully",
    });
  }
};

const filterByDate = async (req, res) => {
  // console.log("filterByDate");
  // const fromDate = req.body.fromDate;
  // const toDate = req.body.toDate;
  // const filterBy = req.body.filterBy;
  // try {
  //   const filteredBooks = await Book.findAll({
  //     where: {
  //       [filterBy]: {
  //         [Op.between]: [fromDate, toDate],
  //       },
  //     },
  //     include: [
  //       {
  //         model: User,
  //         attributes: ["firstname", "mobile"],
  //       },
  //       {
  //         model: Book,
  //         attributes: ["bookname", "isAvalilable"],
  //       },
  //     ],
  //   });
  //   res.status(200).json({ filteredBooks });
  // } catch (error) {
  //   console.error("Error:", error);
  //   res.status(500).json({ message: "An error occurred" });
  // }
};

const deleteBook = async (req, res) => {};

module.exports = {
  addBook,
  borrowBook,
  getAllBook,
  deleteBook,
  getBookById,
  WhoOwnBook,
  HowmanyBookOwn,
  availableBook,
  returnBook,
  getBookByName,
  search,
  filterByDate,
  globalSearch,
};
