const { where } = require('sequelize');
const {task: TaskDB} = require('../models');
const {user: UserDb} = require('../models');
const {userTask: userTaskDB} = require('../models')

// {include: [{model: userTaskDB, as: "legaturi"}]}

const controller = {

    add: async (req, res) => {
        const {taskToCreate, userIds} = req.body;
      
        for(let i = 0;i<userIds.length;i++){
            let user = await UserDb.findByPk(userIds[i]) //console.log(user.dataValues.esteAdmin)
            if(!user){
                return res.status(400).json({
                    message:"nu exista user"
                })
            } 
            
        }
        await TaskDB.create(taskToCreate).then(async(rez)=>{
            const {id} = rez;
            await userIds.forEach(element => {

                let userTaskObj = {
                    idUser: element,
                    idTask: id
                }

                userTaskDB.create(userTaskObj);
            });
        }).catch((err)=> {
            return res.status(500).send(err);
        });

        return res.status(200).json({message: "Ai asignat cu succes task-ul"});
        
    },

    getAll: async (req, res) => {
        try {
            const tasks = await TaskDB.findAll();
            return res.status(200).send(tasks);
        } catch (err) {
            return res.status(500).send(err.message);
        }
    },

    // to do
    getEsteTaskColectiv: async (req, res) => {

        const id = req.params.id;

        try {
            const persoaneCareAuTaskulAsignat = await userTaskDB.findAll({
                where: {
                    idTask: id
                }
            });
            if (persoaneCareAuTaskulAsignat.length > 0) {
                if (persoaneCareAuTaskulAsignat.length > 1) {
                    return res.status(200).json({message: "task colectiv"});
                } else {
                    return res.status(200).json({message: "task individual"});
                }
            } else {
                return res.status(400).json({message: "task neasignat!"});
            }
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

    update: async (req, res) => {
        const {id} = req.params; // params sau body?
        const payload = req.body;

        try {
            await TaskDB.update(payload, {
                where: {id: id}
            })
            return res.status(200).json({message: "Task updated successfully!"});
        } catch(err) {
            return res.status(500).send(err.message);
        }

    }

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
