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
        
        const totalCount = await Task.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limit);

        return res.json({ tasks, totalPages });
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

    // Calculate total count and total pages for the query
    const totalCount = await Task.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    res.json({ tasks, totalPages });
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

const getByIdTask = async(req,res)=>{
  try {
    const taskId = req.params.id; // Extract task ID from request parameters

    // Find the task by its ID
    const task = await Task.findById(taskId);

    // If task is not found, return 404 Not Found error
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // If task is found, return it in the response
    res.json(task);
  } catch (error) {
    // If an error occurs during fetching task, send an error response
    res.status(500).json({ message: error.message });
  }
}



const searchTasksByTitle = async (req, res) => {
  try {
    // Extract the search query from request parameters
    const { search } = req.query;

    // Perform a case-insensitive search for titles matching the search query
    const query = { title: { $regex: new RegExp(search, 'i') } };

    // Find tasks that match the search query
    const tasks = await Task.find(query);

    // If no tasks are found, return a message
    if (tasks.length === 0) {
      return res.json({ message: 'No tasks found.', totalPages: 0 });
    }

    // Calculate total pages
    const limit = 5; // Define your limit here
    const totalCount = tasks.length;
    const totalPages = Math.ceil(totalCount / limit);

    // Return the matching tasks and total pages
    res.json({ tasks, totalPages });
  } catch (error) {
    // If an error occurs during the search, send an error response
    res.status(500).json({ message: error.message });
  }
};


module.exports = { searchTasksByTitle };




module.exports = {
    createTask,
    getTasks,
    deleteTask,
    updateTask,
    getByIdTask,
    searchTasksByTitle
}