const express = require("express");
const { reigsterUser, loginUser } = require("../controller/userController");
const router = express.Router();

router.post("/register", reigsterUser);
router.post("/login", loginUser);

module.exports = router;
