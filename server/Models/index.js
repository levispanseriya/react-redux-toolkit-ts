const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("mediaApp", "root", "", {
  host: "127.0.0.1",
  dialect: "mysql",
  logging: false,
});

try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./User")(sequelize, DataTypes);
db.book = require("./Book")(sequelize, DataTypes);
db.borrowedBook = require("./BorrowedBook")(sequelize, DataTypes);

db.user.hasMany(db.book, {
  foreignKey: "userId",
});
db.book.belongsTo(db.user, {
  foreignKey: "userId",
});

// db.borrowedBook.belongsTo(db.user, { foreignKey: "userId" });
// db.borrowedBook.belongsTo(db.book, { foreignKey: "bookId" });

db.sequelize.sync({ force: false });

module.exports = db;
