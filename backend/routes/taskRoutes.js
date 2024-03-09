const express = require('express')
const router = express.Router()
const taskController = require('../controllers/taskController')


router.route('/createtask').post(taskController.createTask);
router.route('/gettask').get(taskController.getTasks);
router.route('/delete/:id').delete(taskController.deleteTask)
router.route('/update/:id').put(taskController.updateTask);
router.route('/get/:id').get(taskController.getByIdTask);
router.route('/search').get(taskController.searchTasksByTitle)

module.exports = router