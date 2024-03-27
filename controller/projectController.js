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
exports.updateProject = tryCatch(async (req, res) => {
  const { userId } = req.user;
  const projectId = req.params.id;
  const { name, description } = req.body;

  const projectname = z
    .string()
    .nonempty("project name is required")
    .max(50, "name of project must be less than or equal to 50 characters")
    .min(3, "name of project must be more than 2 characters");

  const project = await Project.findById(projectId);

  if (!project) {
    res.status(400);
    throw new Error("project not found !!!");
  }

  if (project.createdBy !== userId) {
    res.status(401);
    throw new Error("you don not have authority to delete this project !!!");
  }
  const validateName = projectname.parse(name);
  if (validateName) {
    project.name = validateName;
  }
  if (description) {
    project.description = description;
  }

  await project.save();

  res.status(200).json({
    success: true,
    data: project,
  });
});
