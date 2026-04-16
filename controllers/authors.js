const router = require("express").Router();
const { User, Blog } = require("../models");

router.get("/", async (req, res, next) => {
  try {
    const users = await User.findAll({
      include: {
        model: Blog,
      },
    });

    const result = users.map((user) => {
      const blogs = user.blogs || [];

      const likes = blogs.reduce((sum, blog) => {
        return sum + (blog.likes || 0);
      }, 0);

      return {
        author: user.name,
        blogs: blogs.length,
        likes: likes,
      };
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
