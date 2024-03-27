const jwt = require("jsonwebtoken");

const generateToken = (res, tokenInfo) => {
  const token = jwt.sign(tokenInfo, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // saving on response cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    withCredentials: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return token;
};

module.exports = generateToken;
