const { z } = require("zod");
const { tryCatch } = require("../utils/tryCatch");
const Task = require("../model/taskModel");
const { default: mongoose } = require("mongoose");

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

  res.status(201).json({
    message: "task created successfully",
    task,
  });
});

exports.getTasks = tryCatch(async (req, res) => {
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
