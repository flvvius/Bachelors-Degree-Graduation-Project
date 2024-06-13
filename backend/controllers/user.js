const {user: UserDb} = require('../models');
const {userTask: UserTaskDB} = require('../models')


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

    getAllUserTasks: async (req, res) => {
        try {
            const usersTasks = await UserTaskDB.findAll();
            res.status(200).send(usersTasks);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getAllAngajati: async (req, res) => {

        try {
            const angajati = await UserDb.findAll({
                where: {
                    esteAdmin: false
                }
            })
            res.status(200).send(angajati);
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

    getUsersByIds: async (req, res) => {
        const ids = req.body.ids;
        try {
            const users = await UserDb.findAll({
                where: {
                    id: ids
                }
            });
            res.status(200).send(users);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    deleteUser: async (req, res) => {
        const id = req.params.id;
        try {

            const user = await UserDb.findByPk(id);
            if (!user) {
                return res.status(400).json({message: "Nu exista user"});
            }

            await UserDb.destroy({
                where: {
                    id: id
                }
            });
            return res.status(200).json({message: "User sters cu succes!"});
        } catch (err) {
            return res.status(500).send(err.message);
        }
    },

    updateUser: async (req, res) => {
        const id = req.params.id;
        const payload = {
            mail: req.body.mail,
            nume: req.body.nume,
            esteAdmin: req.body.esteAdmin,
            apartineFirmei: req.body.apartineFirmei,
            cuantificareTimp: req.body.cuantificareTimp
        };

        try {
            const user = await UserDb.findByPk(id);
            if (!user) return res.status(400).json({message: "User not found"});

            const newUser = await user.update(payload)
            res.status(200).send(newUser);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },
};

module.exports = controller;
