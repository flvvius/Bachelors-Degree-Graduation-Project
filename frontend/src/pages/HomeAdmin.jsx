import { useEffect, useState } from 'react';
import axios from 'axios';
import User from '../components/User';
import UploadTask from '../components/UploadTask';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Flex, Heading, Stack, VStack, useColorMode, useColorModeValue } from '@chakra-ui/react';

const HomeAdmin = ({ user }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`http://localhost:8080/api/user/getAll`)
                .then((response) => {
                    setUsers(response.data);
                });
        }

        fetchData();
    }, []);

    const handleDeleteUser = (userId) => {
        setUsers(users.filter(user => user.id !== userId));
    };

    const handleSubmit = async (formData) => {
        const taskBody = {
            titlu: formData.titlu,
            descriere: formData.descriere,
            deadline: formData.deadline,
            importanta: formData.importanta,
        };

        const userIds = formData.userIds;

        const data = {
            taskToCreate: taskBody,
            userIds: userIds,
        };

        try {
            await axios.post("http://localhost:8080/api/task/add", data, { withCredentials: true });
        } catch (err) {
            console.log(err);
        }
    };

    const navigate = useNavigate();
    const goToFeedback = () => {
        navigate('/feedback');
    };

    const goToAssignedTasks = () => {
        navigate('/tasks');
    };

    const goToStatistics = () => {
        navigate('/statistics');
    };

    const { toggleColorMode } = useColorMode();
    const bg = useColorModeValue('gray.100', 'gray.700');
    const color = useColorModeValue('black', 'white');

    return (
        <Box p={5} bg={bg} minH="100vh">
            <Flex justify="space-between" align="center" mb={5}>
                <Heading color={color}>Admin Dashboard</Heading>
                <Button onClick={toggleColorMode}>
                    Toggle {color === 'black' ? 'Dark' : 'Light'}
                </Button>
            </Flex>
            <Stack spacing={10} align="center">
                <VStack spacing={4} w="100%" maxW="800px">
                    {users.map((localUser) => (
                        <User key={localUser.id} user={localUser} onDelete={handleDeleteUser} />
                    ))}
                </VStack>
                <Box w="100%" maxW="800px">
                    <UploadTask users={users} onSubmit={handleSubmit} />
                </Box>
                <Flex direction={{ base: 'column', md: 'row' }} justify="center" align="center" spacing={4} mt={5}>
                    <Button colorScheme="green" onClick={goToFeedback} m={2}>
                        Vezi feedback
                    </Button>
                    <Button colorScheme="blue" onClick={goToAssignedTasks} m={2}>
                        Vezi task-uri asignate
                    </Button>
                    <Button colorScheme="purple" onClick={goToStatistics} m={2}>
                        Vezi statistici
                    </Button>
                </Flex>
            </Stack>
        </Box>
    );
};

export default HomeAdmin;
