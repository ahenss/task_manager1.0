// routes/tasks.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// @route GET /tasks
// @desc Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /tasks/:id
// @desc Get a single task by ID
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route POST /tasks
// @desc Create a new task
router.post('/', async (req, res) => {
  const { title, description, dueDate } = req.body;
  const newTask = new Task({ title, description, dueDate });
  try {
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route PUT /tasks/:id
// @desc Update a task
router.put('/:id', async (req, res) => {
  const { title, description, dueDate } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, dueDate },
      { new: true }
    );
    if (!updatedTask) return res.status(404).json({ message: 'Task not found' });
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id/complete', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { completed: true }, { new: true });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// @route DELETE /tasks/:id
// @desc Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
