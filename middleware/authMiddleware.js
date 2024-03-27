const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const protect = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      res.status(401);
      throw new Error("Authorization header missing, Not authorized, no token");
    }

    const tokenParts = req.headers.authorization.split(" ");

    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      res.status(401);
      throw new Error("Invalid authorization header format");
    }

    const token = tokenParts[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      res.clearCookie("jwt");
      res.status(401);
      throw new Error("Not authorized, user not found");
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.clearCookie("jwt");
    return next(error);
  }
};

module.exports = protect;
