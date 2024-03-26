const express = require("express");
const { getUser, reigsterUser } = require("../controller/userController");
const router = express.Router();

router.get("/", getUser);
router.post("/register", reigsterUser);

module.exports = router;
