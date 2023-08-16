const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("mediaApp", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

const checkConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

checkConnection();

module.exports = sequelize;
