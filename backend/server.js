const express = require("express");
const env = require("dotenv");
const db = require("./config/config");

env.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log("Server is running on http://localhost:8080");
})

app.get("/reset", async (req,res) => {
    try {
        await db.sync({force: true})
        res.status(200).send("Database reseted successfully!");
    } catch(err) {
        console.log(err);
        res.status(500).send("Error on creating the database!");
    }
})

app.get("/*", async (req, res) => {
    res.status(200).send("Server running!");
})