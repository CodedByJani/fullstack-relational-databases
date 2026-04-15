const jwt = require("jsonwebtoken");
const { SECRET } = require("./config");

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

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      request.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch (error) {
      return response.status(401).json({ error: "token invalid" });
    }
  } else {
    return response.status(401).json({ error: "token missing" });
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

  response.status(500).json({ error: error.message });

  next(error);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  tokenExtractor,
  errorHandler,
};
