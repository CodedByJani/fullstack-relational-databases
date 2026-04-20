const Blog = require("./blog");
const User = require("./user");
const ReadingList = require("./readingList");

User.belongsToMany(Blog, {
  through: ReadingList,
  as: "readings",
  foreignKey: "userId",
});

// BLOG -> USER
Blog.belongsToMany(User, {
  through: ReadingList,
  foreignKey: "blogId",
});

// normal relation
User.hasMany(Blog);
Blog.belongsTo(User);

module.exports = {
  Blog,
  User,
  ReadingList,
};
