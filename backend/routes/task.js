const express = require('express');
const router = express.Router();

const { taskController } = require('../controllers');


router.post('/add', taskController.add);
router.get('/getAll', taskController.getAll);
router.get('/getEsteTaskColectiv/:id', taskController.getEsteTaskColectiv);
// router.get('/:id', [userController.getUserById]);
router.put('/update/:id', taskController.update);


module.exports = router;
