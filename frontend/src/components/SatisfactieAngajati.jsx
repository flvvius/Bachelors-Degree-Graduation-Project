import axios from "axios";
import { useEffect, useState } from "react";
import { Box, Select, Text, VStack, HStack, Flex } from "@chakra-ui/react";

const SatisfactieAngajati = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [averageNotaTask, setAverageNotaTask] = useState({});
    const [averageNotaZiDeLucru, setAverageNotaZiDeLucru] = useState({});
    const [overallAverageNotaTask, setOverallAverageNotaTask] = useState(null);
    const [overallAverageNotaZiDeLucru, setOverallAverageNotaZiDeLucru] = useState(null);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/feedback/getAll");
                setFeedbacks(response.data);
            } catch (err) {
                console.log(err);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/user/getAllAngajati");
                setUsers(response.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchFeedbacks();
        fetchUsers();
    }, []);

    useEffect(() => {
        if (feedbacks.length === 0 || users.length === 0) return;

        const userFeedbacksTask = {};
        const userFeedbacksZiDeLucru = {};

        users.forEach(user => {
            userFeedbacksTask[user.id] = feedbacks.filter(feedback => feedback.idAngajat === user.id && feedback.tip_feedback === "Task");
            userFeedbacksZiDeLucru[user.id] = feedbacks.filter(feedback => feedback.idAngajat === user.id && feedback.tip_feedback === "Zi de lucru");
        });

        const calculateAverageNota = (feedbacks) => {
            if (feedbacks.length === 0) return null;
            const totalNota = feedbacks.reduce((acc, feedback) => acc + feedback.nota, 0);
            return totalNota / feedbacks.length;
        };

        const averageNotaTask = {};
        const averageNotaZiDeLucru = {};

        users.forEach(user => {
            averageNotaTask[user.id] = calculateAverageNota(userFeedbacksTask[user.id]);
            averageNotaZiDeLucru[user.id] = calculateAverageNota(userFeedbacksZiDeLucru[user.id]);
        });

        setAverageNotaTask(averageNotaTask);
        setAverageNotaZiDeLucru(averageNotaZiDeLucru);

        const validUserAveragesTask = Object.values(averageNotaTask).filter(avg => avg !== null);
        if (validUserAveragesTask.length > 0) {
            const overallAverageTask = validUserAveragesTask.reduce((acc, avg) => acc + avg, 0) / validUserAveragesTask.length;
            setOverallAverageNotaTask(overallAverageTask);
        } else {
            setOverallAverageNotaTask(null);
        }

        const validUserAveragesZiDeLucru = Object.values(averageNotaZiDeLucru).filter(avg => avg !== null);
        if (validUserAveragesZiDeLucru.length > 0) {
            const overallAverageZiDeLucru = validUserAveragesZiDeLucru.reduce((acc, avg) => acc + avg, 0) / validUserAveragesZiDeLucru.length;
            setOverallAverageNotaZiDeLucru(overallAverageZiDeLucru);
        } else {
            setOverallAverageNotaZiDeLucru(null);
        }
    }, [feedbacks, users]);

    const handleUserChange = (event) => {
        const userId = event.target.value;
        setSelectedUser(userId);
    };

    return (
        <Box p={5}>
            <Text fontSize="xx-large" textAlign="center" marginBottom={30}>Feedback averages</Text>
            <Flex justify="space-between" alignItems="flex-start" width="100%">
                <Box flex="1" mr={4}>
                    <VStack spacing={3}>
                        <Text fontSize="xl"><strong>Overall Average Feedback Nota (Task)</strong></Text>
                        <Text><strong>Overall Average Nota:</strong> {overallAverageNotaTask ? overallAverageNotaTask.toFixed(2) : "N/A"}</Text>
                        <Text fontSize="xl" mt={5}><strong>Overall Average Feedback Nota (Zi de lucru)</strong></Text>
                        <Text><strong>Overall Average Nota:</strong> {overallAverageNotaZiDeLucru ? overallAverageNotaZiDeLucru.toFixed(2) : "N/A"}</Text>
                    </VStack>
                </Box>
                <Box flex="1">
                    <VStack spacing={3}>
                        <Select placeholder="Select user" onChange={handleUserChange}>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.nume}
                                </option>
                            ))}
                        </Select>
                        {selectedUser !== null && (
                            <VStack spacing={3}>
                                <Text fontSize="xl"><strong>Average Feedback Nota for {users.find(user => user.id === parseInt(selectedUser)).nume}</strong></Text>
                                <Text><strong>Average Nota (Task):</strong> {averageNotaTask[selectedUser] ? averageNotaTask[selectedUser].toFixed(2) : "N/A"}</Text>
                                <Text><strong>Average Nota (Zi de lucru):</strong> {averageNotaZiDeLucru[selectedUser] ? averageNotaZiDeLucru[selectedUser].toFixed(2) : "N/A"}</Text>
                            </VStack>
                        )}
                    </VStack>
                </Box>
            </Flex>
        </Box>
    );
};

export default SatisfactieAngajati;
