const express = require("express");
const { createProject } = require("../controller/projectController");
const router = express.Router();

router.post("/", createProject);

module.exports = router;
