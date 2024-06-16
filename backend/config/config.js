const Sequelize = require("sequelize");
const env = require("dotenv");

env.config();

const db = new Sequelize({
    dialect: process.env.DIALECT || "mysql",
    database: process.env.DATABASE || "Pontaj_APP",
    username: process.env.USERNAME || "root",
    password: process.env.PASSWORD || "",
    host: 'localhost',
    logging: false,
    timezone: '+03:00',
    define: {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    timestamps: false,
    freezeTableName: true
    }
})

module.exports = db;