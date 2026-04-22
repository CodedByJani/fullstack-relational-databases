const router = require("express").Router();
const { ReadingList, Blog, User } = require("../models");
const { tokenExtractor, requireAuth } = require("../util/middleware");

router.post("/", async (req, res, next) => {
  try {
    const { blogId, userId } = req.body;

    if (!userId || !blogId) {
      return res.status(400).json({ error: "userId and blogId required" });
    }

    const user = await User.findByPk(userId);
    const blog = await Blog.findByPk(blogId);

    if (!user || !blog) {
      return res.status(404).json({ error: "user or blog not found" });
    }

    const readingList = await ReadingList.create({ userId, blogId });

    res.json({
      id: readingList.id,
      blog_id: readingList.blogId,
      user_id: readingList.userId,
      read: readingList.read,
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", tokenExtractor, requireAuth, async (req, res, next) => {
  try {
    const readingListEntry = await ReadingList.findByPk(req.params.id);

    if (!readingListEntry) {
      return res.status(404).json({ error: "reading list entry not found" });
    }

    if (readingListEntry.userId !== req.decodedToken.id) {
      return res.status(401).json({ error: "unauthorized" });
    }

    readingListEntry.read = req.body.read;
    await readingListEntry.save();

    res.json(readingListEntry);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
