const { z } = require("zod");
const { tryCatch } = require("../utils/tryCatch");
const Project = require("../model/projectModel");

exports.createProject = tryCatch(async (req, res) => {
  const projectname = z
    .string()
    .nonempty("project name is required")
    .max(50, "name of project must be less than or equal to 50 characters")
    .min(3, "name of project must be more than 2 characters");

  const { userId } = req.user;
  //   const projectDesc = z.string().nonempty(false)

  const { name, description } = req.body;
  const validateName = projectname.parse(name);

  const projectExist = await Project.findOne({ name: validateName });

  if (projectExist) {
    res.status(400);
    throw new Error("project name already exist !!!");
  }

  const project = await Project.create({
    name: validateName,
    description,
    createdBy: userId,
    users: [userId],
  });

  res.status(201).json({
    message: "project created successfully",
    project,
  });
});

exports.getProjects = tryCatch(async (req, res) => {
  const { userId } = req.user;

  const projects = await Project.find({ users: userId });

  res.status(200).json({
    success: true,
    data: projects,
  });
});
