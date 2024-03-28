const express = require("express");

const morgan = require("morgan");
const dotenv = require("dotenv");
// dotenv.config();
dotenv.config({ path: "./config.env" });

const connectDB = require("./config/db");
connectDB();

const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: "",
    credentials: true,
  })
);

const { notFound, errorHandler } = require("./middleware/errorHandler");
const userRouter = require("./routes/userRouter");
const taskRouter = require("./routes/taskRouter");
const projectRouter = require("./routes/projectRouter");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// morgan middleware to log HTTP requests
app.use(morgan("dev"));

app.use("/api/v1/user", userRouter);
// app.use("/api/v1/task", taskRouter);
app.use("/api/v1/project", projectRouter);

app.use(notFound);
app.use(errorHandler);
module.exports = app;
