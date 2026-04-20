const router = require("express").Router();
const { Op } = require("sequelize");

const { Blog, User } = require("../models");
const { tokenExtractor } = require("../util/middleware");

router.get("/", async (req, res, next) => {
  try {
    const where = {};

    if (req.query.search) {
      where[Op.or] = [
        {
          title: {
            [Op.iLike]: `%${req.query.search}%`,
          },
        },
        {
          author: {
            [Op.iLike]: `%${req.query.search}%`,
          },
        },
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

router.post("/", tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken?.id);

    if (!user) {
      return res.status(401).json({ error: "invalid or missing token" });
    }

    const blog = await Blog.create({
      ...req.body,
      year: req.body.year || new Date().getFullYear(),
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

    if (blog) {
      blog.likes = req.body.likes;
      await blog.save();
      res.json(blog);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", tokenExtractor, async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id);

    if (!blog) {
      return res.status(404).end();
    }

    if (blog.userId !== req.decodedToken?.id) {
      return res
        .status(403)
        .json({ error: "only the creator can delete blogs" });
    }

    await blog.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
