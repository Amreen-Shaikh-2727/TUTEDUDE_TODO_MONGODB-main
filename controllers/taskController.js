
const mongoose = require("mongoose");
const taskService = require("../services/taskService");

const getTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getTasks(req.query.search || "");
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask({
      text: req.body.text,
      priority: req.body.priority || "medium",
    });

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task ID." });
    }

    const task = await taskService.updateTask(req.params.id, {
      text: req.body.text,
      ...(req.body.priority !== undefined && {
        priority: req.body.priority,
      }),
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.json(task);
  } catch (err) {
    next(err);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task ID." });
    }

    if (typeof req.body.completed !== "boolean") {
      return res.status(400).json({
        message: "Completed must be true or false.",
      });
    }

    const task = await taskService.updateTask(req.params.id, {
      completed: req.body.completed,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.json(task);
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task ID." });
    }

    const task = await taskService.deleteTask(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.json({ message: "Task deleted successfully." });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  updateStatus,
  deleteTask,
};
