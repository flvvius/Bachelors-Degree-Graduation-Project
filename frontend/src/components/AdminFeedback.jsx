import axios from "axios";
import { useEffect, useState } from "react";
import { Box, Text, Stack } from "@chakra-ui/react";

const AdminFeedback = ({ feedback }) => {
    const [angajat, setAngajat] = useState({});
    const [task, setTask] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/user/get/${feedback.idAngajat}`, { withCredentials: true });
                setAngajat(response.data);

                if (feedback.tip_feedback === "Task") {
                    const responseTask = await axios.get(`http://localhost:8080/api/task/get/${feedback.idTask}`, { withCredentials: true });
                    setTask(responseTask.data);
                }

            } catch (err) {
                console.log(err);
            }
        }

        fetchData();
    }, [feedback.idAngajat, feedback.idTask, feedback.tip_feedback]);

    return (
        <Box p={5} borderWidth="1px" borderRadius="lg" shadow="md">
            <Stack spacing={3}>
                <Text><strong>Tip feedback:</strong> {feedback.tip_feedback}</Text>
                <Text><strong>Nota:</strong> {feedback.nota}</Text>
                <Text><strong>Mesaj:</strong> {feedback.mesaj}</Text>
                <Text><strong>Angajat:</strong> {angajat.nume}</Text>
                {feedback.tip_feedback === "Task" && <Text><strong>Task:</strong> {task.titlu}</Text>}
            </Stack>
        </Box>
    );
}

export default AdminFeedback;
