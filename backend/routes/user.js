const express = require('express');
const router = express.Router();

const { userController } = require('../controllers');


router.post('/add', userController.add);
router.get('/getAll', userController.getAll);
// router.get('/:id', [userController.getUserById]);


module.exports = router;
