const router = require("express").Router();
const { ReadingList, Blog, User } = require("../models");

router.post("/", async (req, res, next) => {
  try {
    const { blogId, userId } = req.body;

    const user = await User.findByPk(userId);
    const blog = await Blog.findByPk(blogId);

    if (!user || !blog) {
      return res.status(400).json({
        error: "invalid userId or blogId",
      });
    }

    const readingList = await ReadingList.create({
      userId,
      blogId,
    });

    res.json(readingList);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
