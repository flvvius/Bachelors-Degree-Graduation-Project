const express = require('express');
const router = express.Router();

const userRouter = require('./user');
const taskRouter = require('./task')
const bonusRouter = require('./bonus')
const feedbackRouter = require('./feedback')
const pontajController = require('./pontaj');

router.use("/user", userRouter);
router.use('/task', taskRouter);
router.use('/bonus', bonusRouter);
router.use('/feedback', feedbackRouter);
router.use("/pontaj", pontajController);

module.exports = router;
