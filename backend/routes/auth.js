const express = require('express');
const passport = require("passport");

const authRouter = express.Router();

authRouter.get("/", passport.authenticate("google", {scope: ["profile", "email"]}));

authRouter.get("/succes", (req, res) => {
    if (req.user) {
        res.status(200).json({
            error: false,
            message: "Successfully logged in",
            user: req.user
        });
    } else {
        res.status(403).json({error: true, message: "Not Authorized"});
    }
})

authRouter.get("/redirect", passport.authenticate("google", {failureRedirect: "/http://localhost:3000/login"}), (req, res) => {
    res.redirect('http://localhost:3000/home');
});

authRouter.get("/logout", (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect("http://localhost:3000/login");
    });
})

module.exports = authRouter;

