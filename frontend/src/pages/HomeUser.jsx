import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import Task from '../components/Task'
import Feedback from '../components/UserFeedback'
import Pontaj from '../components/Pontaj'
import Bonus from '../components/Bonus'

const HomeUser = ({user}) => {

    const [tasks, setTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [bonuses, setBonuses] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`http://localhost:8080/api/task/getTasksByUser/${user.id}`)
                .then((response) => {
                    setTasks(response.data);
                }
            )
            
            await axios.get(`http://localhost:8080/api/bonus/getBonusesByUserId/${user.id}`)
                .then(response => {
                    setBonuses(response.data);
                })


        }
        fetchData();
    }, [user.id])

    const updateTask = (updatedTask) => {
        setTasks(prevTasks => prevTasks.map(
            task => task.id === updatedTask.id ? updatedTask : task
        ));
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };
    
    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className={styles.main_container}>
            <div className={styles.pontaj_container}>                   {/* ilustrare grafica pt pontaj */ }
                
                <Pontaj userId={user.id} />

            </div>

            <div className={styles.tasks_container}>
                <div className={styles.active_tasks_container}>
                    {
                        tasks.filter(task => task.data_finalizare == null).map(task => (
                            <Task key={task.id} task={task} updateTask={updateTask} user={user} /> )
                        )
                    }
                </div>
                <div className={styles.finished_tasks_container}>
                {
                    tasks.filter(task => task.data_finalizare != null).map(task => (
                        <Task key={task.id} task={task} updateTask={updateTask} user={user} /> )
                    )
                }
                </div>
            </div>

            <div className={styles.feedback_container}>
                <button onClick={handleOpenModal}>Acorda feedback pentru ziua de lucru</button>
                <Feedback show={showModal} onClose={handleCloseModal} userId={user.id} taskId={null} />
            </div>

            <h2>Bonusuri</h2>
            <div className={styles.bonuses_container}>

                <div className={styles.unapplied_bonuses_container}>
                    <h3>Bonusuri neaplicate</h3>
                    {
                        bonuses.filter(bonus => bonus.aplicat === false).map(bonus => (
                            <Bonus key={bonus.id} user={user} bonus={bonus} />
                        ))
                    }
                </div>

                <div className={styles.applied_bonuses_container}>
                <h3>Bonusuri aplicate</h3>
                    {
                        bonuses.filter(bonus => bonus.aplicat === true).map(bonus => (
                            <Bonus key={bonus.id} user={user} bonus={bonus} />
                        ))
                    }
                </div>
            </div>

        </div>
    )
}

export default HomeUser;