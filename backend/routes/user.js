const express = require('express');
const router = express.Router();

const { userController } = require('../controllers');


router.post('/add', userController.add);
router.get('/getAll', userController.getAll);
router.get('/getAllAngajati', userController.getAllAngajati);
// router.get('/:id', [userController.getUserById]);
router.delete('/delete/:id', userController.deleteUser);


module.exports = router;
