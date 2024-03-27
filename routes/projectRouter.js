const express = require("express");
const {
  createProject,
  getProjects,
  updateProject,
  getSingleProject,
  deleteProject,
} = require("../controller/projectController");
const { getTasks, createTask } = require("../controller/taskController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, getProjects).post(protect, createProject);
router
  .route("/:id")
  .get(protect, getSingleProject)
  .patch(protect, updateProject)
  .delete(protect, deleteProject);

router
  .route("/:projectId/task")
  .get(protect, getTasks)
  .post(protect, createTask);
module.exports = router;
