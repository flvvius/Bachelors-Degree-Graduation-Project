const {task: TaskDB} = require('../models');


const controller = {

    add: async (req, res) => {
        const taskToCreate = req.body;
        try {
            await TaskDB.create(taskToCreate);
            return res.status(200).send(taskToCreate);
        } catch (err) {
            return res.status(500).send(err.message);
        }
    },

    getAll: async (req, res) => {
        try {
            const tasks = await TaskDB.findAll();
            return res.status(200).send(tasks);
        } catch (err) {
            return res.status(500).send(err.message);
        }
    },

    getTaskById: async (req, res) => {
        const id = req.params.id;
        try {
            const task = await TaskDB.findByPk(id);
            res.status(200).send(task);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    // updateTask: async (req, res) => {
    //     const {userId} = req.params;
    //     const payload = {
    //         firstName: req.body.firstName,
    //         lastName: req.body.lastName,
    //         email: req.body.email,
    //         password: req.body.password,
    //         phone: req.body.phone,
    //         university: req.body.university,
    //         studyYear: req.body.studyYear,
    //     };

    //     try {
    //         const user = await UserDb.findByPk(userId);
    //         if (!user) return res.status(400).send();

    //         const newUser = await user.update(payload)
    //         res.status(200).send(newUser);
    //     } catch (err) {
    //         res.status(500).send(err.message);
    //     }
    // },
};

module.exports = controller;
