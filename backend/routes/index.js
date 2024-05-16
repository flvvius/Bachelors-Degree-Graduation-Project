const express = require('express');
const router = express.Router();

const userRouter = require('./user');
const taskRouter = require('./task')
const bonusRouter = require('./bonus')

router.use("/user", userRouter);
router.use('/task', taskRouter);
router.use('/bonus', bonusRouter);

module.exports = router;
