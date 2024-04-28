const Sequelize = require("sequelize");
const env = require("dotenv");

env.config();

const db = new Sequelize({
    dialect: process.env.DIALECT || "mysql",
    database: process.env.DATABASE || "Pontaj_APP",
    username: process.env.USERNAME || "root",
    password: process.env.PASSWORD || "",
    logging: false,
    define: {
    timestamps: false,
    freezeTableName: true
    }
})

module.exports = db;