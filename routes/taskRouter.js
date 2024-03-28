const express = require("express");
const { dashboardData } = require("../controller/taskController");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/dashboard", protect, dashboardData);

module.exports = router;
