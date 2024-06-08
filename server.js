// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');
const Task = require('./models/Task');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/task-manager', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Use routes
app.use('/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.get('/api/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.send(tasks);
});

app.post('/api/tasks', async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.send(task);
});

app.put('/api/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(task);
});

app.delete('/api/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.send({ message: 'Task deleted' });
});

app.delete('/api/tasks', async (req, res) => {
  try {
    await Task.deleteMany({});
    res.send({ message: 'All tasks deleted' });
  } catch (error) {
    res.status(500).send({ message: 'Error deleting all tasks' });
  }
});


