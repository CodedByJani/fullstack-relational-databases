const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = require("express").Router();

const { SECRET } = require("../util/config");
const { User, Session } = require("../models");

router.post("/", async (request, response, next) => {
  try {
    const { username, password } = request.body;

    const user = await User.findOne({ where: { username } });
    const passwordCorrect = user
      ? await bcrypt.compare(password, user.passwordHash)
      : false;

    if (!(user && passwordCorrect)) {
      return response
        .status(401)
        .json({ error: "invalid username or password" });
    }

    if (user.disabled) {
      return response.status(401).json({ error: "account disabled" });
    }

    const userForToken = { username: user.username, id: user.id };
    const token = jwt.sign(userForToken, SECRET);

    await Session.create({ token, userId: user.id });

    response
      .status(200)
      .send({ token, username: user.username, name: user.name });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
