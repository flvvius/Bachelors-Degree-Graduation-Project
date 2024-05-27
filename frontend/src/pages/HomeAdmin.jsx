import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import axios from 'axios';
import User from '../components/User';
import UploadTask from '../components/UploadTask';
import { useNavigate } from 'react-router-dom';

const HomeAdmin = ({user}) => {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`http://localhost:8080/api/user/getAll`)
                .then((response) => {
                    setUsers(response.data);
                }
            )
        }

        fetchData();
    }, [])

    const handleDeleteUser = (userId) => {
        setUsers(users.filter(user => user.id !== userId));
    };

    const handleSubmit = async (formData) => {

        const taskBody = {
            titlu: formData.titlu,
            descriere: formData.descriere,
            deadline: formData.deadline,
            importanta: formData.importanta
        }

        const userIds = formData.userIds;

        const data = {
            taskToCreate: taskBody,
            userIds: userIds
        }

        try {
            await axios.post("http://localhost:8080/api/task/add", data, {withCredentials: true});
        } catch(err) {
            console.log(err);
        }
    };

    const navigate = useNavigate();
    const goToFeedback = () => {
        navigate('/feedback')
    }

    return (
        <div className={styles.main_container}>
            <div className={styles.users_container}>
                {
                    users.map(localUser => (
                        <User key={localUser.id} user={localUser} onDelete={handleDeleteUser} />
                    ))
                }
            </div>
            <div className={styles.upload_task_container}>
                <UploadTask users={users} onSubmit={handleSubmit} />
            </div>

            <div>
                <button onClick={goToFeedback}>Vezi feedback</button>
            </div>

        </div>
    )
}

export default HomeAdmin;