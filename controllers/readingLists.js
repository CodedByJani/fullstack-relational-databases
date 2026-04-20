const router = require("express").Router();
const { ReadingList, Blog, User } = require("../models");

router.post("/", async (req, res, next) => {
  try {
    const { blogId, userId } = req.body;

    if (!userId || !blogId) {
      return res.status(400).json({ error: "userId and blogId required" });
    }

    const user = await User.findByPk(userId);
    const blog = await Blog.findByPk(blogId);

    if (!user || !blog) {
      return res.status(404).json({
        error: "user or blog not found",
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
