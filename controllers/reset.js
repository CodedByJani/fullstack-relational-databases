const router = require("express").Router();
const { sequelize } = require("../util/db");

router.post("/", async (req, res, next) => {
  try {
    await sequelize.truncate({ cascade: true });

    res.status(200).json({ message: "database reset" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
