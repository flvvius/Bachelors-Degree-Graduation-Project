const db = require("../config/config");
const sequelize = require('sequelize');

const userModel = require('./user');
const taskModel = require('./task');
const userTaskModel = require('./user_task');
const bonusModel = require('./bonus');
const pontajModel = require('./pontaj');
const feedbackModel = require('./feedback');

const user = userModel(db, sequelize);
const task = taskModel(db, sequelize);
const userTask = userTaskModel(db, sequelize);
const bonus = bonusModel(db, sequelize);
const pontaj = pontajModel(db, sequelize);
const feedback = feedbackModel(db, sequelize);

user.belongsToMany(task, {through: "userTask", as: "Tasks", foreignKey: "idUser"});
task.belongsToMany(user, {through: "userTask", as: "Users", foreignKey: "idTask"});

user.hasMany(bonus, {as: "Bonusuri", foreignKey: "idUser"});
bonus.belongsTo(user, {foreignKey: "idUser"});

user.hasMany(pontaj, {as: "Pontari", foreignKey: "idUser"});
pontaj.belongsTo(user, {foreignKey: "idUser"});

user.hasMany(feedback, {as: "SentFeedbacks", foreignKey: "idAngajator"});
feedback.belongsTo(user, {foreignKey: "idAngajator"});

user.hasMany(feedback, {as: "ReceivedFeedbacks", foreignKey: "idAngajat"});
feedback.belongsTo(user, {foreignKey: "idAngajat"});


module.exports = {
    db: db,
    user,
    task,
    userTask,
    bonus,
    pontaj,
    feedback
};