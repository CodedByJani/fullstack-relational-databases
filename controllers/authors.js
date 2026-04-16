const router = require("express").Router();
const { fn, col } = require("sequelize");
const { Blog } = require("../models");

router.get("/", async (req, res, next) => {
  try {
    const authors = await Blog.findAll({
      attributes: [
        "author",
        [fn("count", col("id")), "articles"],
        [fn("sum", col("likes")), "likes"],
      ],
      group: ["author"],
      order: [[fn("sum", col("likes")), "DESC"]],
      raw: true,
    });

    res.json(authors);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
