const express = require('express');
const router = express.Router();

const { feedbackController } = require('../controllers');


router.post('/add', feedbackController.add);
router.get('/getAll', feedbackController.getAll);
// router.get('/:id', bonusController.getUserById);


module.exports = router;
