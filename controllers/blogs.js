const router = require("express").Router();
const { Op } = require("sequelize");

const { Blog, User } = require("../models");
const { tokenExtractor, requireAuth } = require("../util/middleware");

router.get("/", async (req, res, next) => {
  try {
    const where = {};

    if (req.query.search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${req.query.search}%` } },
        { author: { [Op.iLike]: `%${req.query.search}%` } },
      ];
    }

    const blogs = await Blog.findAll({
      attributes: { exclude: ["userId"] },
      include: {
        model: User,
        attributes: ["name"],
      },
      where,
      order: [["likes", "DESC"]],
    });

    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

router.post("/", tokenExtractor, requireAuth, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);

    const blog = await Blog.create({
      ...req.body,
      userId: user.id,
    });

    res.json(blog);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id);

    if (!blog) return res.status(404).end();

    blog.likes = req.body.likes;
    await blog.save();

    res.json(blog);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", tokenExtractor, requireAuth, async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id);

    if (!blog) return res.status(404).end();

    if (blog.userId !== req.decodedToken.id) {
      return res.status(403).json({ error: "only creator can delete blogs" });
    }

    await blog.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
