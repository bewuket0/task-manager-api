const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: string,
      required: [true, "title is required"],
      maxlength: 50,
    },
    description: String,
    dueDate: {
      type: Date,
    },
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
    },
    status: {
      type: String,
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
