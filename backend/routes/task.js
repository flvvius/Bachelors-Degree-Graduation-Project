const express = require('express');
const router = express.Router();

const { taskController } = require('../controllers');


router.post('/add', taskController.add);
router.get('/getAll', taskController.getAll);
// router.get('/:id', [userController.getUserById]);


module.exports = router;
