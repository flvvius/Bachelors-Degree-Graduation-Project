import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import User from '../components/User';
import UploadTask from '../components/UploadTask';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Flex, Heading, Input, Text, VStack, useColorModeValue, useToast } from '@chakra-ui/react';
import * as consts from '../constants.js';

const HomeAdmin = ({ user }) => {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [userListHeight, setUserListHeight] = useState(0);
    const taskRef = useRef(null);

    const toast = useToast();

    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`http://localhost:8080/api/user/getAll`)
                .then((response) => {
                    setUsers(response.data);
                    setFilteredUsers(response.data);
                });
        }

        fetchData();
    }, []);

    useEffect(() => {
        if (taskRef.current) {
            setUserListHeight(taskRef.current.clientHeight);
        }
    }, [taskRef.current]);

    useEffect(() => {
        setFilteredUsers(
            users.filter(user => user.nume && user.nume.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [searchQuery, users]);

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
            return toast({
                title: "Success",
                description: "You successfully submitted the task!",
                status: 'success',
                duration: 9000,
                isClosable: true,
                position: 'top-right'
            });
        } catch (err) {
            console.error(err.response.data.message);
            if (err.response.data.message === "no_title") {
                return toast({
                    title: "No title provided",
                    description: "You need to provide a title for the task!",
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                    position: 'top-right'
                });
            } else if (err.response.data.message === "no_user") {
                return toast({
                    title: "No users selected",
                    description: "You need to select at least one user for the task!",
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                    position: 'top-right'
                });
            } else if (err.response.data.message === "no_date") {
                return toast({
                    title: "No deadline selected",
                    description: "You need to select a deadline for the task!",
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                    position: 'top-right'
                });
            } else if (err.response.data.message === "invalid_date") {
                return toast({
                    title: "Invalid deadline",
                    description: "You need to select a valid deadline for the task!",
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                    position: 'top-right'
                });
            } else if (err.response.data.message === "no_importanta") {
                return toast({
                    title: "No importance selected",
                    description: "You need to select a valid importance level for the task!",
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                    position: 'top-right'
                });
            }
            
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

    const bg = useColorModeValue('gray.100', 'gray.700');
    const color = useColorModeValue('black', 'white');

    return (
        <Box p={5} bg={bg} minH="100vh">
            <Flex justify="space-between" align="center" mb={5}>
                <Heading color={color}>Admin Dashboard</Heading>
            </Flex>
            <Flex justify="center" align="start" direction={{ base: 'column', md: 'row' }} spacing={10}>
                <Flex direction="column" flex="1" mr={{ md: 5 }} mb={{ base: 5, md: 0 }}>
                    <Flex justify="center">
                        <Input
                            placeholder="Search users"
                            mb={4}
                            w="80%"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            border="1px solid grey"
                        />
                    </Flex>
                    <Box maxH={`${userListHeight}px`} overflowY="auto">
                        <VStack spacing={4} w="100%">
                            {filteredUsers.map((localUser) => (
                                <User key={localUser.id} user={localUser} onDelete={handleDeleteUser} />
                            ))}
                        </VStack>
                    </Box>
                </Flex>
                <Box ref={taskRef} flex="1" w="100%" maxW="800px">
                    <Text fontSize="xx-large" mb={4} textAlign="center">Incarcă un task</Text>
                    <UploadTask users={users} onSubmit={handleSubmit} />
                </Box>
            </Flex>
            <Flex justify="center" align="center" spacing={4} mt={5}>
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
        </Box>
    );
};

export default HomeAdmin;
