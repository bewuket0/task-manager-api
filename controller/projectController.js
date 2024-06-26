const { z } = require("zod");
const { tryCatch } = require("../utils/tryCatch");
const Project = require("../model/projectModel");
const { default: mongoose } = require("mongoose");
const User = require("../model/userModel");

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

  //   if (!projects) {
  //     res.status(400);
  //     throw new Error("projects not found !!!");
  //   }
  res.status(200).json({
    success: true,
    data: projects,
  });
});
exports.getSingleProject = tryCatch(async (req, res) => {
  const { userId } = req.user;
  const projectId = req.params.id;

  const project = await Project.findOne({ _id: projectId, users: userId });

  if (!project) {
    res.status(400);
    throw new Error("User is not in the project or project does not exist");
  }

  res.status(200).json({
    success: true,
    data: project,
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

  if (project.createdBy.toString() !== userId) {
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
    message: "project updated successfully",
    data: project,
  });
});

exports.deleteProject = tryCatch(async (req, res) => {
  const { userId } = req.user;
  const projectId = req.params.id;

  const project = await Project.findById(projectId);

  if (!project) {
    res.status(400);
    throw new Error("project not found !!!");
  }

  if (project.createdBy.toString() !== userId) {
    res.status(401);
    throw new Error("you don not have authority to delete this project !!!");
  }

  await Project.deleteOne({ _id: projectId });

  res.status(201).json({
    message: "project deleted successfully",
  });
});

exports.addUserToProject = tryCatch(async (req, res) => {
  const { userId } = req.user;
  const projectId = req.params.id;
  const { memberId } = req.body;

  const project = await Project.findById(projectId);

  if (!project) {
    res.status(400);
    throw new Error("project not found !!!");
  }

  if (project.createdBy.toString() !== userId) {
    res.status(401);
    throw new Error(
      "you don not have authority to add user to this project !!!"
    );
  }

  if (!mongoose.Types.ObjectId.isValid(memberId)) {
    res.status(400);
    throw new Error("Invalid member user id value");
  }
  const userExists = await User.exists({ _id: memberId });
  if (!userExists) {
    res.status(400);
    throw new Error("User with provided member ID does not exist");
  }

  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    { $addToSet: { users: memberId } },
    { new: true }
  );

  res.status(200).json({
    message: "User added to project successfully",
    project: updatedProject,
  });
});

exports.generateReport = tryCatch(async (req, res) => {
  const { userId } = req.user;
  const projectId = req.params.id;

  const project = await Project.findById(projectId).populate("tasks");

  if (!project) {
    res.status(400);
    throw new Error("project not found !!!");
  }

  if (project.createdBy.toString() !== userId) {
    res.status(401);
    throw new Error(
      "you don not have authority to add user to this project !!!"
    );
  }

  let completedTasks = 0;
  let overdueTasks = 0;
  let inProgressTasks = 0;
  let totalTasks = project.tasks.length;

  project.tasks.forEach((task) => {
    if (task.status === "completed") {
      completedTasks++;
    }
    if (task.dueDate && new Date(task.dueDate) < new Date()) {
      overdueTasks++;
    }
    if (task.status === "inprogress") {
      inProgressTasks++;
    }
  });

  const completedPercentage = (completedTasks / totalTasks) * 100;

  const report = {
    totalTasks,
    completedTasks,
    completedPercentage,
    overdueTasks,
    inProgressTasks,
  };

  res.status(200).json({
    message: "report generated successfully",
    report,
  });
});
