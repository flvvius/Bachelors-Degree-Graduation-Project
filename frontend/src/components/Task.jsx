import { useState } from "react";
import axios from "axios";
import styles from '../styles/Task.module.css'
import Feedback from "./UserFeedback";

const Task = ({task, updateTask, user}) => {

    const [localTask, setLocalTask] = useState(task);
    const [showModal, setShowModal] = useState(false);

    const handleClick = async () => {
        const date = new Date();
        const updatedTask = {...localTask, data_finalizare: date}
        setLocalTask(updatedTask);

        try {
            await axios.put(`http://localhost:8080/api/task/update/${updatedTask.id}`, updatedTask, { withCredentials: true })
            updateTask(updatedTask);
        } catch (err) {
            console.error("error updating task: ", err);
        }
    }

    const handleOpenModal = () => {
        setShowModal(true);
    };
    
    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div>
            <p>Titlu: {localTask.titlu}</p>
            <p>Descriere: {localTask.descriere}</p>
            <p>Deadline: {localTask.deadline}</p>
            <p>Importanta: {localTask.importanta}</p>
            <p>Data finalizare: {localTask.data_finalizare ? localTask.data_finalizare.toLocaleString() : "Nefinalizat"}</p>
            {
                !user.esteAdmin && (
                    <>
                        {task.data_finalizare != null ? (
                            <></>
                        ) : (
                            <button onClick={handleClick}>Finalizeaza</button>
                        )}
                        <div className={styles.feedback_container}>
                            <button onClick={handleOpenModal}>Acorda feedback pentru acest task</button>
                            <Feedback show={showModal} onClose={handleCloseModal} userId={user.id} taskId={task.id} />
                        </div>
                    </>
                )
            }

                  
        </div>
    )
}

export default Task;