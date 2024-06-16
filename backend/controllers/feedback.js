const {feedback: feedbackDB} = require('../models');
const {user: userDB} = require('../models');

const controller = {

    add: async (req, res) => {
        const { tip_feedback, nota, mesaj, data, idAngajat, idTask } = req.body;
        const photoPath = req.file ? req.file.path : null;
        const parsedIdTask = idTask ? parseInt(idTask, 10) : null;

        const feedbackObj = {
            tip_feedback,
            nota,
            mesaj,
            photoPath,
            data,
            idAngajat,
            idTask: parsedIdTask
        }

        if (!nota || nota < 1 || nota > 10) {
            return res.status(400).json({message: "invalid_nota"});
        }

        try {

            const angajat = await userDB.findByPk(idAngajat);

            if (!angajat) {
                return res.status(400).json({message: "Utilizator introdus incorect!"});
            }

            await feedbackDB.create(feedbackObj);
            return res.status(200).send(feedbackObj);
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