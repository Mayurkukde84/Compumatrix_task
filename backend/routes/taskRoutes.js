const express = require('express')
const router = express.Router()
const taskController = require('../controllers/taskController')


router.route('/createtask').post(taskController.createTask);
router.route('/gettask').get(taskController.getTasks);
router.route('/delete/:id').delete(taskController.deleteTask)
router.route('/update/:id').put(taskController.updateTask);

module.exports = router