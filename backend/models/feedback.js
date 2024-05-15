const Feedback = (db, DataTypes) => db.define("Feedback", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    tip_feedback: {
        type: DataTypes.STRING,
        allowNull: false
    },

    nota: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    mesaj: {
        type: DataTypes.STRING,
        allowNull: false
    },

    idAngajator: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    idAngajat: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

module.exports = Feedback;