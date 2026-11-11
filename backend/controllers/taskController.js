import mongoose from "mongoose";
import Task from "../models/Task.js";

export async function getTasks(_req, res) {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch {
    res.status(500).json({ message: "Failed to retrieve tasks" });
  }
}

export async function createTask(req, res) {
  try {
    const title = typeof req.body.title === "string" ? req.body.title.trim() : "";

    if (!title) {
      return res.status(400).json({ message: "Task title is required" });
    }

    const task = await Task.create({ title });
    res.status(201).json(task);
  } catch {
    res.status(500).json({ message: "Failed to create task" });
  }
}

export async function updateTask(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    if (typeof req.body.completed !== "boolean") {
      return res.status(400).json({ message: "completed must be true or false" });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { completed: req.body.completed },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch {
    res.status(500).json({ message: "Failed to update task" });
  }
}

export async function deleteTask(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch {
    res.status(500).json({ message: "Failed to delete task" });
  }
}
