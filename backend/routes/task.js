const express = require('express');
const router = express.Router();

const { taskController } = require('../controllers');


router.post('/add', taskController.add);
router.get('/getAll', taskController.getAll);
router.get('/getEsteTaskColectiv/:id', taskController.getEsteTaskColectiv);
router.get('/getTasksByUser/:id', taskController.getTasksByUser);
router.get('/getFinishedTasksByUser/:id', taskController.getFinishedTasksByUser);
router.get('/getUsersByTask/:id', taskController.getUsersByTask);
router.get('/get/:id', taskController.getTaskById);
router.put('/update/:id', taskController.update);


module.exports = router;
