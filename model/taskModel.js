const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      maxlength: 50,
    },
    description: String,
    dueDate: {
      type: Date,
    },
    priority: {
      type: String,
      default: "low",
      enum: ["high", "medium", "low"],
    },
    status: {
      type: String,
      default: "todo",
      enum: ["inprogress", "todo", "complete", "review"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assignTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "project is required"],
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
