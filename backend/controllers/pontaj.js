const {pontaj: pontajDB} = require('../models');

const controller = {

    add: async (req, res) => {
        const pontajToCreate = req.body;
        try {
            await pontajDB.create(pontajToCreate);
            res.status(200).send(pontajToCreate);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getAll: async (req, res) => {
        try {
            const pontaje = await pontajDB.findAll();
            res.status(200).send(pontaje);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getUserById: async (req, res) => {
        const id = req.params.id;
        try {
            const pontaj = await pontajDB.findByPk(id);
            res.status(200).send(pontaj);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

};

module.exports = controller;