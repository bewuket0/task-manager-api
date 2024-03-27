const express = require("express");
const {
  getUser,
  reigsterUser,
  loginUser,
} = require("../controller/userController");
const router = express.Router();

router.get("/", getUser);
router.post("/register", reigsterUser);
router.post("/login", loginUser);

module.exports = router;
