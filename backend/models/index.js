const db = require("../config/config");
const sequelize = require('sequelize');

const userModel = require('./user');
const taskModel = require('./task');
const userTaskModel = require('./user_task');

const user = userModel(db, sequelize);
const task = taskModel(db, sequelize);
const userTask = userTaskModel(db, sequelize);

//Employee.belongsToMany(Joburi, {through: "JobEmployee", as: "Jobs", foreignKey: "EmployeeId"});
//Joburi.belongsToMany(Employee, {through: "JobEmployee", as: "Employees", foreignKey: "JobId"});

user.belongsToMany(task, {through: "userTask", as: "Tasks", foreignKey: "idUser"});
task.belongsToMany(user, {through: "userTask", as: "Users", foreignKey: "idTask"});


module.exports = {
    db: db,
    user,
    task,
    userTask
};