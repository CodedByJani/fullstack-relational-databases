const Blog = require("./blog");
const User = require("./user");
const ReadingList = require("./readingList");

User.belongsToMany(Blog, {
  through: ReadingList,
  foreignKey: "userId",
});

Blog.belongsToMany(User, {
  through: ReadingList,
  foreignKey: "blogId",
});

ReadingList.belongsTo(User, { foreignKey: "userId" });
ReadingList.belongsTo(Blog, { foreignKey: "blogId" });

User.hasMany(ReadingList, { foreignKey: "userId" });
Blog.hasMany(ReadingList, { foreignKey: "blogId" });

User.hasMany(Blog);
Blog.belongsTo(User);

module.exports = {
  Blog,
  User,
  ReadingList,
};
