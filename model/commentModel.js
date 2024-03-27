const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      requried: [true, "comment text required"],
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      requried: [true, "task is required for comment "],
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      requried: [true, "author id is required for comment "],
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
