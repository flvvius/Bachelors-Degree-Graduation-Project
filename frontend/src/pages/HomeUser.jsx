import { useEffect, useState } from 'react';
import axios from 'axios';
import Task from '../components/Task';
import Feedback from '../components/UserFeedback';
import Pontaj from '../components/Pontaj';
import Bonus from '../components/Bonus';
import { Box, Button, Flex, Heading, Stack } from '@chakra-ui/react';

const HomeUser = ({ user }) => {
    const [tasks, setTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [bonuses, setBonuses] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`http://localhost:8080/api/task/getTasksByUser/${user.id}`)
                .then((response) => {
                    setTasks(response.data);
                });

            await axios.get(`http://localhost:8080/api/bonus/getBonusesByUserId/${user.id}`)
                .then(response => {
                    setBonuses(response.data);
                });
        }
        fetchData();
    }, [user.id]);

    const updateTask = (updatedTask) => {
        setTasks(prevTasks => prevTasks.map(
            task => task.id === updatedTask.id ? updatedTask : task
        ));
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <Box p={5}>
            <Flex mb={5}>
                <Box flex="1">
                    <Pontaj userId={user.id} />
                </Box>
            </Flex>

            <Flex justify="space-between" alignItems="flex-start" height="50vh">
                <Box flex="1" mr={4} maxW="50%">
                    <Heading as="h2" size="lg" mb={4}>Active Tasks</Heading>
                    <Box overflowY="auto" maxH="45vh">
                        <Stack spacing={4}>
                            {tasks.filter(task => task.data_finalizare == null).map(task => (
                                <Task key={task.id} task={task} updateTask={updateTask} user={user} />
                            ))}
                        </Stack>
                    </Box>
                </Box>

                <Box flex="1" maxW="50%">
                    <Heading as="h2" size="lg" mb={4}>Finished Tasks</Heading>
                    <Box overflowY="auto" maxH="45vh">
                        <Stack spacing={4}>
                            {tasks.filter(task => task.data_finalizare != null).map(task => (
                                <Task key={task.id} task={task} updateTask={updateTask} user={user} />
                            ))}
                        </Stack>
                    </Box>
                </Box>
            </Flex>

            <Box mt={10}>
                <Button colorScheme="teal" onClick={handleOpenModal}>Acorda feedback pentru ziua de lucru</Button>
                <Feedback show={showModal} onClose={handleCloseModal} userId={user.id} taskId={null} />
            </Box>

            <Heading as="h2" size="lg" mt={10} mb={4}>Bonusuri</Heading>
            <Flex justify="space-between" wrap="wrap" height="50vh">
                <Box flex="1" minW="300px" mr={4} maxW="50%">
                    <Heading as="h3" size="md" mb={4}>Bonusuri neaplicate</Heading>
                    <Box overflowY="auto" maxH="45vh">
                        <Stack spacing={4}>
                            {bonuses.filter(bonus => bonus.aplicat === false).map(bonus => (
                                <Bonus key={bonus.id} user={user} bonus={bonus} />
                            ))}
                        </Stack>
                    </Box>
                </Box>

                <Box flex="1" minW="300px" maxW="50%">
                    <Heading as="h3" size="md" mb={4}>Bonusuri aplicate</Heading>
                    <Box overflowY="auto" maxH="45vh">
                        <Stack spacing={4}>
                            {bonuses.filter(bonus => bonus.aplicat === true).map(bonus => (
                                <Bonus key={bonus.id} user={user} bonus={bonus} />
                            ))}
                        </Stack>
                    </Box>
                </Box>
            </Flex>
        </Box>
    );
}

export default HomeUser;
