const express = require('express');
const router = express.Router();

const { bonusController } = require('../controllers');


router.post('/add', bonusController.add);
router.get('/getAll', bonusController.getAll);
// router.get('/:id', bonusController.getUserById);


module.exports = router;
