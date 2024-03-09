const Task = require('../model/taskSchema');

// Controller function for creating a new task
const createTask = async (req, res) => {
  try {
    // Create a new task instance based on the request body
    const newTask = new Task({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status
    });

    // Save the new task to the database
    const savedTask = await newTask.save();

    // Send the saved task as a response
    res.status(201).json(savedTask);
  } catch (error) {
    // If an error occurs during task creation, send an error response
    res.status(400).json({ message: error.message });
  }
};



// Controller function for getting tasks with sorting options
const getTasks = async (req, res) => {
  try {
    let query = {};
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let limit = 5;
    let skip = (page - 1) * limit;

    // Check if status parameter is provided
    if (req.query.status) {
      // If status is 'latest', sort tasks by updatedAt in descending order
      if (req.query.status === 'latest') {
        query.status = { $ne: null }; // Exclude null status
        const tasks = await Task.find(query)
          .sort({ updatedAt: -1 })
          .limit(limit)
          .skip(skip);
        return res.json(tasks);
      }
      // If status is 'pending', filter tasks with status 'pending'
      else if (req.query.status === 'pending') {
        query.status = 'pending';
      }
      // If status is 'inprogress', filter tasks with status 'in progress'
      else if (req.query.status === 'inprogress') {
        query.status = 'in progress';
      }
      // If status is 'completed', filter tasks with status 'completed'
      else if (req.query.status === 'completed') {
        query.status = 'completed';
      }
    }

    // Fetch tasks based on the query with pagination
    const tasks = await Task.find(query)
      .limit(limit)
      .skip(skip);
    res.json(tasks);
  } catch (error) {
    // If an error occurs during fetching tasks, send an error response
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async(req,res)=>{
    try {
        console.log(req.params.id)
        const taskId = req.params.id;
        const deletedTask = await Task.findByIdAndDelete(taskId);
        if (!deletedTask) {
          return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
}

const updateTask = async(req,res)=>{
    try {
        const taskId = req.params.id;
        const { title, description, status } = req.body;
    
        // Find the task by ID and update its fields
        const updatedTask = await Task.findByIdAndUpdate(taskId, {
          title,
          description,
          status,
          updatedAt: new Date() // Update updatedAt time
        }, { new: true });
    
        if (!updatedTask) {
          return res.status(404).json({ message: 'Task not found' });
        }
    
        res.json(updatedTask);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
}


module.exports = {
    createTask,
    getTasks,
    deleteTask,
    updateTask
}