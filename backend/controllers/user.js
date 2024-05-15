const {user: UserDb} = require('../models');


const controller = {

    add: async (req, res) => {
        const userToCreate = req.body;
        try {
            await UserDb.create(userToCreate);
            res.status(200).send(userToCreate);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getAll: async (req, res) => {
        try {
            const users = await UserDb.findAll();
            res.status(200).send(users);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getUserById: async (req, res) => {
        const id = req.params.id;
        try {
            const user = await UserDb.findByPk(id);
            res.status(200).send(user);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    updateUser: async (req, res) => {
        const {userId} = req.params;
        const payload = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
            university: req.body.university,
            studyYear: req.body.studyYear,
        };

        try {
            const user = await UserDb.findByPk(userId);
            if (!user) return res.status(400).send();

            const newUser = await user.update(payload)
            res.status(200).send(newUser);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },
};

module.exports = controller;
