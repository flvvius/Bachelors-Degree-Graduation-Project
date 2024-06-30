const express = require('express');
const router = express.Router();

const { userController } = require('../controllers');


router.post('/add', userController.add);
router.get('/getAll', userController.getAll);
router.get('/getAllUsersTasks', userController.getAllUserTasks);
router.get('/getAllAngajati', userController.getAllAngajati);
router.get('/get/:id', userController.getUserById);
router.get('/getByIds', userController.getUsersByIds);
router.delete('/delete/:id', userController.deleteUser);
router.put('/update/:id', userController.updateUser);
router.get('/raport', userController.generareRaport);
router.get('/raportExcel', userController.generareRaportExcel);


module.exports = router;
