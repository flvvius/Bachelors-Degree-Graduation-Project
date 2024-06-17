import { useEffect, useState } from "react";
import axios from "axios";
import Task from "../components/Task";
import Feedback from "../components/UserFeedback";
import Pontaj from "../components/Pontaj";
import Bonus from "../components/Bonus";
import { Box, Button, Flex, Heading, Input, Stack, useColorModeValue } from "@chakra-ui/react";
import { format } from 'date-fns';

const HomeUser = ({ user }) => {
    const [tasks, setTasks] = useState([]);
    const [bonuses, setBonuses] = useState([]);
    const [esteColectivMap, setEsteColectivMap] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const [tasksResponse, bonusesResponse] = await Promise.all([
                axios.get(`http://localhost:8080/api/task/getTasksByUser/${user.id}`, { withCredentials: true }),
                axios.get(`http://localhost:8080/api/bonus/getBonusesByUserId/${user.id}`, { withCredentials: true })
            ]);

            const formattedTasks = tasksResponse.data.map(task => ({
                ...task,
                deadline: task.deadline ? format(new Date(task.deadline), 'yyyy-MM-dd HH:mm:ss') : null
            }));

            setTasks(formattedTasks);
            setBonuses(bonusesResponse.data);

            const esteColectivPromises = tasksResponse.data.map(task =>
                axios.get(`http://localhost:8080/api/task/getEsteTaskColectiv/${task.id}`, { withCredentials: true })
                    .then(response => ({
                        taskId: task.id,
                        esteColectiv: response.data.message === "task colectiv"
                    }))
                    .catch(err => {
                        console.log(err);
                        return { taskId: task.id, esteColectiv: false };
                    })
            );

            const esteColectivResults = await Promise.all(esteColectivPromises);
            const esteColectivMap = esteColectivResults.reduce((map, result) => {
                map[result.taskId] = result.esteColectiv;
                return map;
            }, {});

            setEsteColectivMap(esteColectivMap);
        };

        fetchData();
    }, [user.id]);

    const updateTask = async (updatedTask) => {
        try {
            await axios.put(`http://localhost:8080/api/task/update/${updatedTask.id}`, updatedTask, { withCredentials: true });
            setTasks(prevTasks => prevTasks.map(
                task => task.id === updatedTask.id ? updatedTask : task
            ));
        } catch (error) {
            console.error("Failed to update task", error);
        }
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredTasks = tasks.filter(task => task.titlu.toLowerCase().includes(searchQuery.toLowerCase()));

    const bg = useColorModeValue('gray.100', 'gray.700');
    const color = useColorModeValue('black', 'white');

    return (
        <Box p={5} bg={bg}>
            <Flex mb={5}>
                <Box flex="1">
                    <Pontaj user={user} />
                </Box>
            </Flex>

            <Flex mt={10} justifyContent="center" alignItems="center" marginBottom={41}>
                <Button colorScheme="blue" onClick={handleOpenModal}>Acorda feedback pentru ziua de lucru</Button>
                <Feedback show={showModal} onClose={handleCloseModal} userId={user.id} taskId={null} />
            </Flex>

            <Input 
                placeholder="Search tasks" 
                value={searchQuery}
                onChange={handleSearchChange}
                mb={4}
                border="1px solid gray"
            />

            <Box mb={10}>
                <Heading as="h2" size="lg" mb={4}>Active Tasks</Heading>
                <Flex justify="space-between" alignItems="flex-start">
                    <Box flex="1" mr={2}>
                        <Heading as="h3" size="md" mb={2}>Individual</Heading>
                        <Box overflowY="auto" maxH="45vh">
                            <Stack spacing={4}>
                                {filteredTasks.filter(task => task.data_finalizare == null && !esteColectivMap[task.id]).map(task => (
                                    <Task
                                        key={task.id}
                                        task={task}
                                        updateTask={updateTask}
                                        user={user}
                                        esteColectiv={esteColectivMap[task.id]}
                                    />
                                ))}
                            </Stack>
                        </Box>
                    </Box>
                    <Box flex="1" ml={2}>
                        <Heading as="h3" size="md" mb={2}>Collective</Heading>
                        <Box overflowY="auto" maxH="45vh">
                            <Stack spacing={4}>
                                {filteredTasks.filter(task => task.data_finalizare == null && esteColectivMap[task.id]).map(task => (
                                    <Task
                                        key={task.id}
                                        task={task}
                                        updateTask={updateTask}
                                        user={user}
                                        esteColectiv={esteColectivMap[task.id]}
                                    />
                                ))}
                            </Stack>
                        </Box>
                    </Box>
                </Flex>
            </Box>

            <Box mb={10}>
                <Heading as="h2" size="lg" mb={4}>Finished Tasks</Heading>
                <Flex justify="space-between" alignItems="flex-start">
                    <Box flex="1" mr={2}>
                        <Heading as="h3" size="md" mb={2}>Individual</Heading>
                        <Box overflowY="auto" maxH="45vh">
                            <Stack spacing={4}>
                                {filteredTasks.filter(task => task.data_finalizare != null && !esteColectivMap[task.id]).map(task => (
                                    <Task
                                        key={task.id}
                                        task={task}
                                        updateTask={updateTask}
                                        user={user}
                                        esteColectiv={esteColectivMap[task.id]}
                                    />
                                ))}
                            </Stack>
                        </Box>
                    </Box>
                    <Box flex="1" ml={2}>
                        <Heading as="h3" size="md" mb={2}>Collective</Heading>
                        <Box overflowY="auto" maxH="45vh">
                            <Stack spacing={4}>
                                {filteredTasks.filter(task => task.data_finalizare != null && esteColectivMap[task.id]).map(task => (
                                    <Task
                                        key={task.id}
                                        task={task}
                                        updateTask={updateTask}
                                        user={user}
                                        esteColectiv={esteColectivMap[task.id]}
                                    />
                                ))}
                            </Stack>
                        </Box>
                    </Box>
                </Flex>
            </Box>

            <Box flex="1" w="100%" mr={4}>
                <Heading as="h2" size="lg" mt={10} mb={4}>Bonusuri</Heading>
                <Flex flexDirection="row" justifyContent="space-evenly" alignItems="center" w="100%">
                    <Box flex="1" overflowY="auto" maxH="45vh" mr={2}>
                        <Stack spacing={4}>
                            {bonuses.filter(bonus => bonus.id % 2 === 1).map(bonus => (
                                <Bonus key={bonus.id} user={user} bonus={bonus} />
                            ))}
                        </Stack>
                    </Box>
                    <Box flex="1" overflowY="auto" maxH="45vh" ml={2}>
                        <Stack spacing={4}>
                            {bonuses.filter(bonus => bonus.id % 2 === 0).map(bonus => (
                                <Bonus key={bonus.id} user={user} bonus={bonus} />
                            ))}
                        </Stack>
                    </Box>
                </Flex>
            </Box>
        </Box>
    );
};

export default HomeUser;
