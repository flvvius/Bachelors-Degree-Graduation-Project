const {feedback: feedbackDB} = require('../models');

const controller = {

    add: async (req, res) => {
        const feedbackToCreate = req.body;
        try {
            await feedbackDB.create(feedbackToCreate);
            res.status(200).send(feedbackToCreate);
        } catch (err) {
            res.status(500).send(err.message);
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