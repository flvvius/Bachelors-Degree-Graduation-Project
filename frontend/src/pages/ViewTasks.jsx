import axios from "axios";
import { useEffect, useState } from "react";
import Task from "../components/Task";
import { useNavigate } from "react-router-dom";

const ViewTasks = ({user}) => {

    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/task/getAll`, {withCredentials: true});
                setTasks(response.data);
            } catch(err) {
                console.log(err)
            }
        }

        fetchData();

    }, [])

    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate('/home');
    }

    return (
        <div>
            <h1>Tasks</h1>
            {
                tasks.map(task => (
                    <Task key={task.id} task={task} updateTask={null} user={user} />
                ))
            }
            <button onClick={handleGoBack}>Go back</button>
        </div>
    )
}

export default ViewTasks;