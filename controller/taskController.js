const { z } = require("zod");
const { tryCatch } = require("../utils/tryCatch");
const Task = require("../model/taskModel");
const { default: mongoose } = require("mongoose");
const Project = require("../model/projectModel");
const User = require("../model/userModel");
const Comment = require("../model/commentModel");
const sendNotification = require("../utils/sendNotification");

exports.createTask = tryCatch(async (req, res) => {
  const { userId } = req.user;
  const projectId = req.params.projectId;

  const taskSchema = z.object({
    title: z
      .string()
      .nonempty("title is required")
      .max(50, "title must be less than or equal to 50 characters")
      .min(3, "title must be more than 3 characters"),
    description: z
      .string()
      //   .optional(true)
      .max(150, "description must be less than or equal to 150 characters")
      .optional(),

    dueDate: z
      .date()
      .min(new Date(), { message: "should not be greater than current time" }),
  });

  const { title, description, dueDate, priority, status, assignTo } = req.body;

  const validateData = taskSchema.parse({
    title,
    description,
    dueDate: new Date(dueDate),
  });

  const taskExist = await Task.findOne({
    title: validateData.title,
    project: projectId,
  });

  if (taskExist) {
    res.status(400);
    throw new Error("task name already exist on this project !!!");
  }

  const projectExist = await Project.findById(projectId);
  if (!projectExist) {
    res.status(400);
    throw new Error("project doenot exist !!!");
  }

  if (assignTo) {
    if (!mongoose.Types.ObjectId.isValid(assignTo)) {
      res.status(400);
      throw new Error("Invalid assignedTo user id value");
    }
    const userExists = await User.exists({ _id: assignTo });
    if (!userExists) {
      res.status(400);
      throw new Error("User with provided assignTo ID does not exist");
    }
  }

  const task = await Task.create({
    title: validateData.title,
    description: validateData.description,
    dueDate: validateData.dueDate,
    priority,
    status,
    createdBy: userId,
    assignTo,
    project: projectId,
  });

  // Add the task ID to the tasks array of the project
  await Project.findByIdAndUpdate(projectId, {
    $push: { tasks: task._id },
  });

  res.status(201).json({
    message: "task created successfully",
    task,
  });
});

exports.getTasks = tryCatch(async (req, res) => {
  const { userId } = req.user;
  const projectId = req.params.projectId;

  const tasks = await Task.find({ project: projectId });

  if (!tasks) {
    res.status(400);
    throw new Error("tasks for this project not found !!!");
  }

  res.status(200).json({
    message: "tasks for this project",
    data: tasks,
  });
});

exports.getSingleTask = tryCatch(async (req, res) => {
  const { userId } = req.user;
  const projectId = req.params.projectId;
  const taskId = req.params.taskId;

  const task = await Task.find({ _id: taskId });

  if (!task) {
    res.status(400);
    throw new Error("tasks not found !!!");
  }

  res.status(200).json({
    message: "task detail info",
    data: task,
  });
});

exports.updateTask = tryCatch(async (req, res) => {
  const { userId } = req.user;
  const projectId = req.params.projectId;
  const taskId = req.params.taskId;

  const taskSchema = z.object({
    title: z
      .string()
      .nonempty("title is required")
      .max(50, "title must be less than or equal to 50 characters")
      .min(3, "title must be more than 3 characters"),
    description: z
      .string()
      .max(150, "description must be less than or equal to 150 characters")
      .optional(),

    dueDate: z
      .date()
      .min(new Date(), { message: "should not be greater than current time" }),
  });

  const { title, description, dueDate, priority, status, assignTo } = req.body;

  const validatedData = taskSchema.parse({
    title,
    description,
    dueDate: new Date(dueDate),
  });

  const task = await Task.findById(taskId);

  if (!task) {
    res.status(400);
    throw new Error("task not found !!!");
  }

  if (task.createdBy.toString() !== userId) {
    res.status(401);
    throw new Error("you don not have authority to delete this task !!!");
  }

  if (assignTo) {
    if (!mongoose.Types.ObjectId.isValid(assignTo)) {
      res.status(400);
      throw new Error("Invalid assignedTo user id value");
    }
    const userExists = await User.exists({ _id: assignTo });
    if (!userExists) {
      res.status(400);
      throw new Error("User with provided assignTo ID does not exist");
    }
  }

  task.title = validatedData.title;
  task.description = validatedData.description;
  task.dueDate = validatedData.dueDate;
  task.priority = priority;
  task.status = status;
  task.assignTo = assignTo;

  const updatedTask = await task.save();

  if (updatedTask.assignTo) {
    await sendNotification({
      type: "task_updated",
      content: `   ${task.title} : task is updated`,
      recipient: task.assignTo,
    });
  }
  await sendNotification({
    type: "task_updated",
    content: `   ${task.title} : task is updated`,
    recipient: userId,
  });

  res.status(200).json({
    message: "task updated successfully",
    task: updatedTask,
  });
});
exports.deleteTask = tryCatch(async (req, res) => {
  const { userId } = req.user;
  const projectId = req.params.projectId;
  const taskId = req.params.taskId;

  const task = await Task.findById(taskId);

  if (!task) {
    res.status(400);
    throw new Error("task not found !!!");
  }

  if (task.createdBy.toString() !== userId) {
    res.status(401);
    throw new Error("you don not have authority to delete this task !!!");
  }

  const project = await Project.findById(projectId);
  if (!project) {
    res.status(400);
    throw new Error("project not found !!!");
  }

  // Remove the taskId from the tasks array of the project
  await Project.findByIdAndUpdate(projectId, { $pull: { tasks: taskId } });

  // Delete the task
  await Task.findByIdAndDelete(taskId);

  res.status(200).json({
    message: "task deleted successfully",
  });
});

exports.assignTask = tryCatch(async (req, res) => {
  const { userId } = req.user;
  const projectId = req.params.projectId;
  const taskId = req.params.taskId;

  const { assignTo } = req.body;

  const task = await Task.findById(taskId);

  if (!task) {
    res.status(400);
    throw new Error("tasks not found !!!");
  }
  if (task.createdBy.toString() !== userId) {
    res.status(401);
    throw new Error("you don not have authority to assign this task !!!");
  }

  if (!mongoose.Types.ObjectId.isValid(assignTo)) {
    res.status(400);
    throw new Error("Invalid assignedTo user id value");
  }
  const userExists = await User.exists({ _id: assignTo });
  if (!userExists) {
    res.status(400);
    throw new Error("User with provided assignTo ID does not exist");
  }

  const project = await Project.findById(projectId);

  // check if the assignTo user exist on project.users list if not throw error
  if (!project.users.includes(assignTo)) {
    res.status(400);
    throw new Error("assignto user isnot in the project ");
  }

  // update the task with assigned user
  task.assignTo = assignTo;
  await task.save();

  await sendNotification({
    type: "task_assigned",
    content: `You have been assigned a task : ${task.title}`,
    recipient: assignTo,
  });

  await sendNotification({
    type: "task_assigned",
    content: `You have  assign a user for : ${task.title}`,
    recipient: userId,
  });

  res.status(200).json({
    message: "task is assigned to user",
    data: task,
  });
});

exports.sendComment = tryCatch(async (req, res) => {
  const { userId } = req.user;
  const projectId = req.params.projectId;
  const taskId = req.params.taskId;

  const { message } = req.body;
  const task = await Task.findById(taskId);

  if (!task) {
    res.status(400);
    throw new Error("tasks not found !!!");
  }

  const messageSchem = z
    .string()
    .max(200, "comment message cannot be more than 200 characters")
    .optional();

  const validMessage = messageSchem.parse(message);

  const comment = await Comment.create({
    message: validMessage,
    task: taskId,
    author: userId,
  });

  await Task.findByIdAndUpdate(taskId, { $push: { comments: comment._id } });

  res.status(200).json({
    message: "comment sent successfully",
    comment,
  });
});

exports.changeStatus = tryCatch(async (req, res) => {
  const { userId } = req.user;
  const projectId = req.params.projectId;
  const taskId = req.params.taskId;

  const { status } = req.body;
  const task = await Task.findById(taskId);

  if (!task) {
    res.status(400);
    throw new Error("tasks not found !!!");
  }

  if (task.assignTo) {
    if (task.assignTo.toString() !== userId) {
      res.status(401);
      throw new Error(
        "you don not have authority to change this task status !!!"
      );
    }
  }
  if (task.createdBy.toString() !== userId) {
    res.status(401);
    throw new Error(
      "you don not have authority to change this task status !!!"
    );
  }

  task.status = status;
  await task.save();

  if (task.assignTo) {
    await sendNotification({
      type: "task_updated",
      content: `task status changed for : ${task.title}`,
      recipient: task.assignTo,
    });
  }

  await sendNotification({
    type: "task_updated",
    content: `task status changed for : ${task.title}`,
    recipient: task.createdBy,
  });

  res.status(200).json({
    message: "status changed successfully",
    task,
  });
});
