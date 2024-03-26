const express = require("express");

const morgan = require("morgan");
const dotenv = require("dotenv");
// dotenv.config();
dotenv.config({ path: "./config.env" });

const connectDB = require("./config/db");
connectDB();

const app = express();
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// morgan middleware to log HTTP requests
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("inst. page");
  console.log("institiute");
});

module.exports = app;
