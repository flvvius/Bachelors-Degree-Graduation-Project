import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import Task from '../components/Task'

const HomeUser = ({user}) => {

    // const currentDate = ...

    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`http://localhost:8080/api/task/getTasksByUser/${user.id}`)
                .then((response) => {
                    setTasks(response.data);
                })
        }
        fetchData();
    }, [user.id])

    console.log(tasks);

    return (
        <div className={styles.main_container}>
            <div className={styles.pontaj_container}>                   {/* ilustrare grafica pt pontaj */ }
                <h1 className={styles.ceva}>Pontaj</h1> 

                <button>Check-In</button>
                <button>Check-Out</button>    

            </div>

            <div className={styles.tasks_container}>
                <div className={styles.active_tasks_container}>
                    {
                        tasks.map(task => (
                            <Task key={task.id} task={task} /> )
                        )
                    }
                </div>
                <div className={styles.finished_tasks_container}>
                    
                </div>
            </div>

        </div>
    )
}

export default HomeUser;