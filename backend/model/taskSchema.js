const mongoose = require('mongoose');

// Define the task schema
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'in progress'], // Define possible values for status
    default: 'pending' // Default status
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create a model based on the schema
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
