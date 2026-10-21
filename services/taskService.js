
const Todo = require("../models/Task");

const getTasks = async (search = "") => {
  const filter = {};

  if (search.trim()) {
    filter.text = {
      $regex: search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      $options: "i",
    };
  }

  return Todo.find(filter).sort({ createdAt: -1 });
};

const createTask = async (data) => {
  return Todo.create(data);
};

const updateTask = async (id, data) => {
  return Todo.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

const deleteTask = async (id) => {
  return Todo.findByIdAndDelete(id);
};

const getTaskById = async (id) => {
  return Todo.findById(id);
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
};
