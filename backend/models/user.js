const User = (db, DataTypes) => db.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    mail: {
        type: DataTypes.STRING,
        allowNull: false
    },

    nume: {
        type: DataTypes.STRING,
        allowNull: false
    },

    esteAdmin: {
        type: DataTypes.BOOLEAN
    },

    apartineFirmei: {
        type: DataTypes.BOOLEAN
    }
})

module.exports = User;