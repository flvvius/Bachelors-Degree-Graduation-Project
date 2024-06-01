const {pontaj: pontajDB} = require('../models');
const { Sequelize, Op } = require('sequelize');

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

    getPontajByUser: async (req, res) => {
        const idUser = req.params.id;

        try {
            const pontaj = await pontajDB.findAll({
                where: {
                    idUser: idUser
                }
            });
            res.status(200).send(pontaj);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getPontajByData: async (req, res) => {

        const {id} = req.params;

        const searchDate = new Date();
        const day = searchDate.getDate();
        const month = searchDate.getMonth() + 1;

        try {
            const pontaj = await pontajDB.findOne({
                where: {
                    [Op.and]: [
                        Sequelize.where(Sequelize.fn('DAY', Sequelize.col('data')), day),
                        Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('data')), month)
                    ],
                    idUser: id

                }
            })
                return res.status(200).send(pontaj);
        } catch (err) {
            console.error(err);
            return res.status(400).json({message: err});
        }
    }

};

module.exports = controller;