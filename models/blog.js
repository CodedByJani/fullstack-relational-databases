const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../util/db");

class Blog extends Model {}

Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1991,
        max: new Date().getFullYear(),
        isValidYear(value) {
          if (
            value !== null &&
            (value < 1991 || value > new Date().getFullYear())
          ) {
            throw new Error(
              `year must be between 1991 and ${new Date().getFullYear()}`,
            );
          }
        },
      },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "blog",
  },
);

module.exports = Blog;
