import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import Task from '../components/Task'
import Feedback from '../components/Feedback'
import Pontaj from '../components/Pontaj'

const HomeUser = ({user}) => {

    const [tasks, setTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`http://localhost:8080/api/task/getTasksByUser/${user.id}`)
                .then((response) => {
                    setTasks(response.data);
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
                
                <Pontaj />

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

        </div>
    )
}

export default HomeUser;