import { useState } from "react";
import axios from "axios";

const Task = ({task}) => {

    const [localTask, setLocalTask] = useState(task);

    const handleClick = async () => {
        const date = new Date();
        const updatedTask = {...localTask, data_finalizare: date}
        setLocalTask(updatedTask);

        try {
            await axios.put(`http://localhost:8080/api/task/update/${updatedTask.id}`, updatedTask, { withCredentials: true })
        } catch (err) {
            console.error("error updating task: ", err);
        }
    }

    return (
        <>
            <p>Titlu: {localTask.titlu}</p>
            <p>Descriere: {localTask.descriere}</p>
            <p>Deadline: {localTask.deadline}</p>
            <p>Importanta: {localTask.importanta}</p>
            <p>Data finalizare: {localTask.data_finalizare ? localTask.data_finalizare.toLocaleString() : "Nefinalizat"}</p>
            <button onClick={handleClick}>Finalizeaza</button>
        </>
    )
}

export default Task;