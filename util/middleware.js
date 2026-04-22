const jwt = require("jsonwebtoken");
const { SECRET } = require("./config");
const { Session, User } = require("../models");

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const tokenExtractor = async (request, response, next) => {
  const authorization = request.get("authorization");

  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    const token = authorization.substring(7);
    try {
      request.decodedToken = jwt.verify(token, SECRET);
      request.token = token;

      const session = await Session.findOne({ where: { token } });
      if (!session) {
        return response.status(401).json({ error: "session expired" });
      }

      const user = await User.findByPk(request.decodedToken.id);
      if (!user || user.disabled) {
        return response.status(401).json({ error: "account disabled" });
      }
    } catch (error) {
      return response.status(401).json({ error: "token invalid" });
    }
  } else {
    request.decodedToken = null;
  }

  next();
};

const requireAuth = (req, res, next) => {
  if (!req.decodedToken) {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "SequelizeValidationError") {
    return response.status(400).json({
      error: error.errors.map((e) => e.message),
    });
  }

  if (error.name === "SequelizeUniqueConstraintError") {
    return response.status(400).json({
      error: error.errors.map((e) => e.message),
    });
  }

  if (error.name === "SequelizeForeignKeyConstraintError") {
    return response.status(400).json({
      error: "invalid reference (foreign key constraint)",
    });
  }

  return response.status(500).json({
    error: "internal server error",
  });
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  tokenExtractor,
  requireAuth,
  errorHandler,
};
