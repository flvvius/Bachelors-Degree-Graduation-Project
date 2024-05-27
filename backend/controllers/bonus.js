const {bonus: bonusDB} = require('../models');

const controller = {

    add: async (req, res) => {
        const bonusToCreate = req.body;
        try {
            await bonusDB.create(bonusToCreate);
            res.status(200).send(bonusToCreate);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getAll: async (req, res) => {
        try {
            const bonuses = await bonusDB.findAll();
            res.status(200).send(bonuses);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getBonusesByUserId: async (req, res) => {
        const id = req.params.id;
        try {
            const bonuses = await bonusDB.findAll({
                where: {
                    idUser: id
                }
            });
            res.status(200).send(bonuses);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

};

module.exports = controller;