const {user: UserDb, feedback:FeedbackDB} = require('../models');
const {userTask: UserTaskDB} = require('../models')
const {task: TaskDb} = require('../models')
const PDFDocument = require('pdfkit');
const { Op, Sequelize } = require('sequelize');

const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

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

    generareRaport: async (req, res) => {
        const { date, type } = req.query;
    
        if (!date || !type) {
            return res.status(400).json({ error: 'Date and type are required parameters' });
        }
    
        let startDate, endDate;
        if (type === 'year') {
            startDate = new Date(date, 0, 1);
            endDate = new Date(date, 11, 31);
        } else {
            const [year, month] = date.split('-');
            startDate = new Date(year, month - 1, 1);
            endDate = new Date(year, month, 0);
        }
    
        console.log(`Generating report from ${startDate} to ${endDate}`);
    
        try {
            const userData = await UserDb.findAll({
                where: {
                    esteAdmin: 0,
                },
                include: [
                    {
                        model: TaskDb,
                        as: 'Tasks',
                        where: {
                            data_finalizare: {
                                [Op.between]: [startDate, endDate]
                            }
                        },
                        through: { attributes: [] }
                    }
                ]
            });
    
            if (!userData.length) {
                console.log('No data found for the specified date range');
                return res.status(404).json({ error: 'No data found for the specified date range' });
            }
    
            const doc = new PDFDocument();
            let buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                let pdfData = Buffer.concat(buffers);
                res.writeHead(200, {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment; filename=raport.pdf',
                    'Content-Length': pdfData.length,
                }).end(pdfData);
            });
    
            doc.text(`Report for ${type === 'year' ? 'Year' : 'Month'}: ${date}`);
            userData.forEach(user => {
                doc.text(`Employee: ${user.nume} - ${user.mail}`);
                user.cuantificareTimp < 0 ? doc.text(`Worked ${formatTime(Math.abs(Math.floor(user.cuantificareTimp)))} less`) : doc.text(`Worked extra ${formatTime(Math.floor(user.cuantificareTimp))}`);
                doc.text(`Number of Tasks Finished: ${user.Tasks.length}`);
                doc.moveDown();
            });
    
            doc.end();
        } catch (error) {
            console.error('Error generating report:', error);
            res.status(500).json({ error: 'Failed to generate report' });
        }
    }
    
};

module.exports = controller;
