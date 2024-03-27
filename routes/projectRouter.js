const express = require("express");
const {
  createProject,
  getProjects,
  updateProject,
} = require("../controller/projectController");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").get(protect, getProjects).post(protect, createProject);
router.route("/:id").patch(protect, updateProject);
module.exports = router;
