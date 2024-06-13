import axios from "axios";
import { useEffect, useState } from "react";
import Task from "../components/Task";
import { useNavigate } from "react-router-dom";
import { Box, Button, Flex, Heading, Input, SimpleGrid, useColorModeValue } from "@chakra-ui/react";

const ViewTasks = ({ user }) => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/task/getAll`, { withCredentials: true });
                setTasks(response.data);
                setFilteredTasks(response.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const filtered = tasks.filter(task => task.titlu.toLowerCase().includes(searchQuery.toLowerCase()));
        setFilteredTasks(filtered);
    }, [searchQuery, tasks]);

    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate('/home');
    };

    const bg = useColorModeValue('gray.100', 'gray.700');

    return (
        <Box p={5} bg={bg}>
            <Heading mb={5}>Tasks</Heading>
            <Flex mb={5} justify="space-between" align="center">
                <Input
                    placeholder="Search by task title"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    mr={2}
                    maxW="300px"
                    border="1px solid gray"
                />
                <Button colorScheme="blue" onClick={handleGoBack}>Go back</Button>
            </Flex>
            <Box overflowY="auto" maxHeight="80vh">
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                    {filteredTasks.map(task => (
                        <Task key={task.id} task={task} updateTask={null} user={user} />
                    ))}
                </SimpleGrid>
            </Box>
        </Box>
    );
}

export default ViewTasks;
