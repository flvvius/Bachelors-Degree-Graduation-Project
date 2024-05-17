const express = require('express');
const router = express.Router();

const { pontajController } = require('../controllers');


router.post('/add', pontajController.add);
router.get('/getAll', pontajController.getAll);
// router.get('/:id', bonusController.getUserById);


module.exports = router;
