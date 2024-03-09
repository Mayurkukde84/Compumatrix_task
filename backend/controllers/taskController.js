const Task = require('../model/taskSchema');


const createTask = async (req, res) => {
  try {

    const newTask = new Task({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status
    });


    const savedTask = await newTask.save();


    res.status(201).json(savedTask);
  } catch (error) {

    res.status(400).json({ message: error.message });
  }
};




const getTasks = async (req, res) => {
  try {
    let query = {};
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let limit = 5;
    let skip = (page - 1) * limit;

   
    if (req.query.status) {
      
      if (req.query.status === 'latest') {
        query.status = { $ne: null }; 
        const tasks = await Task.find(query)
          .sort({ updatedAt: -1 })
          .limit(limit)
          .skip(skip);
        
        const totalCount = await Task.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limit);

        return res.json({ tasks, totalPages });
      }
     
      else if (req.query.status === 'pending') {
        query.status = 'pending';
      }
      else if (req.query.status === 'inprogress') {
        query.status = 'inprogress';
      }
      else if (req.query.status === 'completed') {
        query.status = 'completed';
      }
    }

    const tasks = await Task.find(query)
      .limit(limit)
      .skip(skip);

    const totalCount = await Task.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    res.json({ tasks, totalPages });
  } catch (error) {
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
    
      
        const updatedTask = await Task.findByIdAndUpdate(taskId, {
          title,
          description,
          status,
          updatedAt: new Date() 
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
    const taskId = req.params.id; 

    
    const task = await Task.findById(taskId);

   
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    
    res.status(500).json({ message: error.message });
  }
}



const searchTasksByTitle = async (req, res) => {
  try {
  
    const { search } = req.query;


    const query = { title: { $regex: new RegExp(search, 'i') } };


    const tasks = await Task.find(query);

  
    if (tasks.length === 0) {
      return res.json({ message: 'No tasks found.', totalPages: 0 });
    }


    const limit = 5; 
    const totalCount = tasks.length;
    const totalPages = Math.ceil(totalCount / limit);


    res.json({ tasks, totalPages });
  } catch (error) {
  
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