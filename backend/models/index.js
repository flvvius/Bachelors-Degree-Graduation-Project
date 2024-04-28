const sequelize = require("../config/config");
const {DataTypes} = require('sequelize');

const userModel = require('./user');
const taskModel = require('./task');

const user = userModel(sequelize, DataTypes);
const task = taskModel(sequelize, DataTypes);


module.exports = {
    connectionDb: sequelize,
    user,
    task
};