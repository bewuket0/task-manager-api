const { tryCatch } = require("../utils/tryCatch");

exports.createProject = tryCatch(async (req, res) => {
  res.status(201).json({
    message: "project created successfully",
  });
});
