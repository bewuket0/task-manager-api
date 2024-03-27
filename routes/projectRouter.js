const express = require("express");
const {
  createProject,
  getProjects,
  updateProject,
  getSingleProject,
  deleteProject,
} = require("../controller/projectController");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").get(protect, getProjects).post(protect, createProject);
router
  .route("/:id")
  .get(protect, getSingleProject)
  .patch(protect, updateProject)
  .delete(protect, deleteProject);
module.exports = router;
