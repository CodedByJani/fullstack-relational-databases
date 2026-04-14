require("dotenv").config();
const express = require("express");
const { Sequelize } = require("sequelize");

const app = express();
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
});

app.use(express.json());

const PORT = process.env.PORT || 3001;

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection successful");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database connection failed:", err);
  });
