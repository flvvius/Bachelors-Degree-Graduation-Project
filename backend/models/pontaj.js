const Pontaj = (db, DataTypes) => db.define("Pontaj", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    data: {
        type: DataTypes.DATE,
        allowNull: false
    },

    check_in: {
        type: DataTypes.DATE,
        allowNull: false
    },

    check_out: {
        type: DataTypes.DATE
    },

    idUser: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

module.exports = Pontaj;