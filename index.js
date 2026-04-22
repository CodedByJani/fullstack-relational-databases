const express = require("express");
const app = express();

const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");

const {
  requestLogger,
  unknownEndpoint,
  errorHandler,
} = require("./util/middleware");

const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const authorsRouter = require("./controllers/authors");
const resetRouter = require("./controllers/reset");
const readingListsRouter = require("./controllers/readingLists");
const logoutRouter = require("./controllers/logout");

app.use(express.json());
app.use(requestLogger);

app.get("/", (req, res) => {
  res.status(200).send("ok");
});

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/authors", authorsRouter);
app.use("/api/reset", resetRouter);
app.use("/api/readinglists", readingListsRouter);
app.use("/api/logout", logoutRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

const start = async () => {
  try {
    await connectToDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

if (require.main === module) {
  start();
}

module.exports = app;
