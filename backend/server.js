const express = require("express");
const env = require("dotenv");
const {db} = require("./models");
const cors = require('cors');
const router = require('./routes')
const auth = require('./config/auth');
const session = require("express-session");
const passport = require('passport');

env.config();

const app = express();

const port = process.env.PORT || 8080;

process.env.TZ = 'Europe/Bucharest';

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Methods", "Access-Control-Request-Headers"],
        credentials: true,
        enablePreflight: true
    })
);

app.use(session({
    secret: "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",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1 * 60 * 60 * 1000, // 1 hour
        secure: false,
        httpOnly: true
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", router);

app.use('/uploads', express.static('uploads')); // ???

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

app.listen(port, () => {
    console.log("Server is running on http://localhost:8080");
})