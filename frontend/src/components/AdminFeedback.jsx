import axios from "axios";
import { useEffect, useState } from "react";

const AdminFeedback = ({feedback}) => {

    const [angajat, setAngajat] = useState([]);
    const [task, setTask] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/user/get/${feedback.idAngajat}`, {withCredentials: true});
                setAngajat(response.data);

                const responseTask = await axios.get(`http://localhost:8080/api/task/get/${feedback.idTask}`, {withCredentials: true});
                setTask(responseTask.data);

            } catch(err) {
                console.log(err)
            }
        }

        fetchData();

    }, [])

    return (
        <div>
            <p>Tip feedback: {feedback.tip_feedback}</p>
            <p>Nota: {feedback.nota}</p>
            <p>Mesaj: {feedback.mesaj}</p>
            <p>Angajat: {angajat.nume}</p>
            {feedback.tip_feedback === "Task" ? <p>Task: {task.titlu}</p> : null}
        </div>
    )
}

export default AdminFeedback;