const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
require('dotenv').config();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Define Todo schema and model
const todoSchema = new mongoose.Schema({
  text: String,
  priority: { type: String, default: "medium" },
});
const Todo = mongoose.model("Todo", todoSchema);

// Home page - show all todos
app.get("/", async (req, res) => {
  const todos = await Todo.find();
  res.render("list", { todos });
});

// Add todo
app.post("/", async (req, res) => {
  const { element, priority } = req.body;
  if (element && element.trim()) {
    await Todo.create({ text: element.trim(), priority: priority || "medium" });
  }
  res.redirect("/");
});

// Edit todo
app.put("/edit/:id", async (req, res) => {
  const id = req.params.id;
  if (req.body.text && req.body.text.trim()) {
    await Todo.findByIdAndUpdate(id, { text: req.body.text.trim() });
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

// Delete todo
app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  await Todo.findByIdAndDelete(id);
  res.sendStatus(200);
});

const PORT =process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});