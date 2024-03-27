const express = require("express");
const { createProject } = require("../controller/projectController");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, createProject);

module.exports = router;
