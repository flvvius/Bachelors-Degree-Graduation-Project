const UserTask = (db, DataTypes) => db.define("UserTask", {
    idUser: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: false
    },
    idTask: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: false
    }
})

module.exports = UserTask;