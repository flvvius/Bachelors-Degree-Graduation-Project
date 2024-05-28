import { useState } from "react";
import axios from "axios";
import { Box, Button, Text, VStack, useDisclosure } from "@chakra-ui/react";
import Feedback from "./UserFeedback";

const Task = ({ task, updateTask, user }) => {
    const [localTask, setLocalTask] = useState(task);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleClick = async () => {
        const date = new Date();
        const updatedTask = { ...localTask, data_finalizare: date };
        setLocalTask(updatedTask);

        try {
            await axios.put(`http://localhost:8080/api/task/update/${updatedTask.id}`, updatedTask, { withCredentials: true });
            updateTask(updatedTask);
        } catch (err) {
            console.error("error updating task: ", err);
        }
    };

    return (
        <Box p={5} borderWidth="1px" borderRadius="lg" shadow="md">
            <VStack align="start" spacing={3}>
                <Text fontSize="md"><strong>Titlu:</strong> {localTask.titlu}</Text>
                <Text fontSize="md"><strong>Descriere:</strong> {localTask.descriere}</Text>
                <Text fontSize="md"><strong>Deadline:</strong> {localTask.deadline}</Text>
                <Text fontSize="md"><strong>Importanta:</strong> {localTask.importanta}</Text>
                <Text fontSize="md"><strong>Data finalizare:</strong> {localTask.data_finalizare ? new Date(localTask.data_finalizare).toLocaleString() : "Nefinalizat"}</Text>
                {!user.esteAdmin && (
                    <>
                        {localTask.data_finalizare ? null : (
                            <Button colorScheme="teal" onClick={handleClick}>Finalizeaza</Button>
                        )}
                        <Box mt={3}>
                            <Button colorScheme="teal" onClick={onOpen}>Acorda feedback pentru acest task</Button>
                            <Feedback show={isOpen} onClose={onClose} userId={user.id} taskId={task.id} />
                        </Box>
                    </>
                )}
            </VStack>
        </Box>
    );
};

export default Task;
