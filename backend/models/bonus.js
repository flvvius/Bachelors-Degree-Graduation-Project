const Bonus = (db, DataTypes) => db.define("Bonus", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    cuantum_bonus: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    descriere_bonus: {
        type: DataTypes.STRING
    },

    aplicat: {
        type: DataTypes.BOOLEAN
    },

    idUser: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

module.exports = Bonus;