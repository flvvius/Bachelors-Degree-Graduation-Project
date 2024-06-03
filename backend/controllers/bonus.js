const {bonus: bonusDB} = require('../models');

const controller = {

    add: async (req, res) => {
        const bonusToCreate = req.body;
    
        if (!bonusToCreate || bonusToCreate.cuantum_bonus === undefined || bonusToCreate.cuantum_bonus === null) {
            return res.status(400).json({message: "Cuantum bonus is required"});
        }
    
        if (bonusToCreate.cuantum_bonus <= 0) {
            return res.status(400).json({message: "Nu poti acorda un bonus negativ!"});
        }
    
        try {
            const createdBonus = await bonusDB.create(bonusToCreate);
            return res.status(201).send(createdBonus);
        } catch (err) {
            console.error(err);
            return res.status(500).send({message: err.message});
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