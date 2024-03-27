const express = require("express");
const {
  createProject,
  getProjects,
} = require("../controller/projectController");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").get(protect, getProjects).post(protect, createProject);

module.exports = router;
