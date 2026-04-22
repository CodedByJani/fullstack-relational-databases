const router = require("express").Router();
const bcrypt = require("bcryptjs");

const { User, Blog, ReadingList } = require("../models");

// GET ALL USERS
router.get("/", async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["passwordHash"] },
      include: {
        model: Blog,
        attributes: { exclude: ["userId"] },
      },
    });

    res.json(users);
  } catch (error) {
    next(error);
  }
});

// GET USER BY ID (READING LIST WITH FILTERING)
router.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["passwordHash"] },
      include: [
        {
          model: Blog,
          as: "readings",
          attributes: { exclude: ["userId"] },
          through: {
            attributes: ["id", "read"],
          },
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    let userJSON = user.toJSON();
    let readings = userJSON.readings.map((blog) => {
      return {
        id: blog.id,
        author: blog.author,
        url: blog.url,
        title: blog.title,
        likes: blog.likes,
        year: blog.year,
        reading_list: {
          id: blog.readingList.id,
          read: blog.readingList.read,
        },
      };
    });

    if (req.query.read !== undefined) {
      const readValue = req.query.read === "true";
      readings = readings.filter(
        (blog) => blog.reading_list.read === readValue,
      );
    }

    res.json({
      name: userJSON.name,
      username: userJSON.username,
      readings,
    });
  } catch (error) {
    next(error);
  }
});

// CREATE USER
router.post("/", async (req, res, next) => {
  try {
    const { username, name, password } = req.body;

    if (!username || !name || !password) {
      return res.status(400).json({ error: "missing fields" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      name,
      passwordHash,
    });

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

// UPDATE USER
router.put("/:username", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { username: req.params.username },
    });

    if (!user) {
      return res.status(404).end();
    }

    user.name = req.body.name;
    await user.save();

    res.json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
