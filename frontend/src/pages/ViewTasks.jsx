import axios from "axios";
import { useEffect, useState } from "react";
import Task from "../components/Task";
import { useNavigate } from "react-router-dom";
import { Box, Button, Heading, Stack } from "@chakra-ui/react";

const ViewTasks = ({ user }) => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/task/getAll`, { withCredentials: true });
                setTasks(response.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);

    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate('/home');
    };

    return (
        <Box p={5}>
            <Heading mb={5}>Tasks</Heading>
            <Box overflowY="auto" maxHeight="80vh">
                <Stack spacing={4}>
                    {tasks.map(task => (
                        <Task key={task.id} task={task} updateTask={null} user={user} />
                    ))}
                </Stack>
            </Box>
            <Button mt={5} colorScheme="teal" onClick={handleGoBack}>Go back</Button>
        </Box>
    );
}

export default ViewTasks;
