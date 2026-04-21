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

// PUT /api/readinglists/:id - Mark blog as read/unread
router.put("/:id", tokenExtractor, requireAuth, async (req, res, next) => {
  try {
    const readingListEntry = await ReadingList.findByPk(req.params.id);

    if (!readingListEntry) {
      return res.status(404).json({ error: "reading list entry not found" });
    }

    // Check if the reading list entry belongs to the logged-in user
    if (readingListEntry.userId !== req.decodedToken.id) {
      return res
        .status(403)
        .json({ error: "only the creator can update this entry" });
    }

    // Update the read status
    readingListEntry.read = req.body.read;
    await readingListEntry.save();

    res.json(readingListEntry);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
