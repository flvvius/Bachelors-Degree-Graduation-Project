const {feedback: feedbackDB} = require('../models');
const {user: userDB} = require('../models');

const controller = {

    add: async (req, res) => {
        const feedbackToCreate = req.body;

        try {

            const angajat = await userDB.findByPk(feedbackToCreate.idAngajat);

            if (!angajat) {
                return res.status(400).json({message: "Utilizator introdus incorect!"});
            }

            await feedbackDB.create(feedbackToCreate);
            return res.status(200).send(feedbackToCreate);
        } catch (err) {
            return res.status(500).send(err.message);
        }
    },

    getAll: async (req, res) => {
        try {
            const feedbacks = await feedbackDB.findAll();
            res.status(200).send(feedbacks);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getUserById: async (req, res) => {
        const id = req.params.id;
        try {
            const feedback = await feedbackDB.findByPk(id);
            res.status(200).send(feedback);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

};

module.exports = controller;