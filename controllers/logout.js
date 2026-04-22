const router = require("express").Router();
const { Session } = require("../models");
const { tokenExtractor, requireAuth } = require("../util/middleware");

router.delete("/", tokenExtractor, requireAuth, async (req, res, next) => {
  try {
    await Session.destroy({ where: { token: req.token } });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
