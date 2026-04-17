const Sequelize = require("sequelize");
const { DATABASE_URL } = require("./config");

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions:
    process.env.NODE_ENV === "production"
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();

    // 🔥 THIS FIXES "relation does not exist" IN GITHUB ACTIONS
    await sequelize.sync();

    console.log("connected to the database");
  } catch (err) {
    console.error("DB CONNECTION ERROR:");
    console.error(err);
    process.exit(1);
  }
};

module.exports = { connectToDatabase, sequelize };
