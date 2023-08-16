module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define(
    "Book",
    {
      bookId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      bookname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isAvalilable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      borrowDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      returnDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    { timestamps: false }
  );
  return Book;
};
