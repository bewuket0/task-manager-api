const express = require("express");
const {
  createProject,
  getProjects,
  updateProject,
  getSingleProject,
  deleteProject,
  addUserToProject,
} = require("../controller/projectController");
const {
  getTasks,
  createTask,
  getSingleTask,
  deleteTask,
  updateTask,
  assignTask,
  sendComment,
} = require("../controller/taskController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, getProjects).post(protect, createProject);
router
  .route("/:id")
  .get(protect, getSingleProject)
  .patch(protect, updateProject)
  .delete(protect, deleteProject);

router.post("/:id/adduser", protect, addUserToProject);

router
  .route("/:projectId/task")
  .get(protect, getTasks)
  .post(protect, createTask);

router
  .route("/:projectId/task/:taskId")
  .get(protect, getSingleTask)
  .patch(protect, updateTask)
  .delete(protect, deleteTask);

router.post("/:projectId/task/:taskId/assign", protect, assignTask);

router.post("/:projectId/task/:taskId/comment", protect, sendComment);
module.exports = router;
