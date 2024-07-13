const {user: UserDb, feedback:FeedbackDB} = require('../models');
const {userTask: UserTaskDB} = require('../models')
const {task: TaskDb} = require('../models')
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const { Op, Sequelize } = require('sequelize');
const nodemailer = require('nodemailer');

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
    
            doc.fontSize(20).text('Employee Report', { align: 'center' }).moveDown(1.5);
            doc.fontSize(14).text(`Report for ${type === 'year' ? 'Year' : 'Month'}: ${date}`).moveDown(1.5);

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
    },

    generareRaportExcel: async (req, res) => {
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
    
        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = endDate.toISOString().split('T')[0];
    
        console.log(`Generating report from ${startDate.toISOString()} to ${endDate.toISOString()}`);
    
        try {
            const userData = await UserDb.findAll({
                where: {
                    esteAdmin: 0,
                },
                attributes: [
                    'id', 'nume', 'mail',
                    [Sequelize.fn('AVG', Sequelize.col('ReceivedFeedbacks.nota')), 'averageNota']
                ],
                include: [
                    {
                        model: FeedbackDB,
                        as: 'ReceivedFeedbacks',
                        attributes: [],
                        where: {
                            data: {
                                [Op.between]: [startDate, endDate]
                            }
                        },
                        required: false //LEFT JOIN
                    }
                ],
                group: ['User.id']
            });
    
            console.log(`Fetched user data: ${JSON.stringify(userData, null, 2)}`);
    
            if (!userData.length) {
                console.log('No data found for the specified date range');
                return res.status(404).json({ error: 'No data found for the specified date range' });
            }
    
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Report');
    
            worksheet.mergeCells('A1:C1');
            worksheet.getCell('A1').value = `Report Date Range: ${formattedStartDate} to ${formattedEndDate}`;
            worksheet.getCell('A1').font = { bold: true };
            worksheet.addRow([]);
    
            worksheet.addRow(['Employee Name', 'Email', 'Average Feedback']);
            
            worksheet.columns = [
                { key: 'name', width: 30 },
                { key: 'email', width: 30 },
                { key: 'averageFeedback', width: 20 },
            ];
    
            userData.forEach(user => {
                const averageNota = user.dataValues.averageNota !== null ? parseFloat(user.dataValues.averageNota).toFixed(2) : 'No Feedback';
                worksheet.addRow({
                    name: user.nume,
                    email: user.mail,
                    averageFeedback: averageNota
                });
            });
    
            const buffer = await workbook.xlsx.writeBuffer();
    
            res.writeHead(200, {
                'Content-Disposition': 'attachment; filename=report.xlsx',
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Length': buffer.length
            });
            res.end(buffer);
        } catch (error) {
            console.error('Error generating report:', error);
            res.status(500).json({ error: 'Failed to generate report' });
        }
    },

    trimiteEmail: async (req, res) => {

        const { email, subject, text } = req.body;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL,
              pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: subject,
            text: text,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
              res.status(500).send('Error sending email');
            } else {
              console.log('Email sent: ' + info.response);
              res.status(200).send('Email sent');
            }
        });
    },
    
};

module.exports = controller;
