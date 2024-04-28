const Task = (db, DataTypes) => db.define("Task", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    titlu: {
        type: DataTypes.STRING,
        allowNull: false
    },

    descriere: {
        type: DataTypes.STRING,
        allowNull: false
    },

    deadline: {
        type: DataTypes.DATE,
        allowNull: false
    },

    importanta: {
        type: DataTypes.STRING,
        allowNull: false
    },

    data_finalizare: {
        type: DataTypes.DATE,
        allowNull: false
    }
})

module.exports = Task;