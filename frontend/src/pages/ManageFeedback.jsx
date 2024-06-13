import axios from "axios";
import { useEffect, useState } from "react";
import AdminFeedback from "../components/AdminFeedback";
import { useNavigate } from "react-router-dom";
import { Box, Button, Flex, Heading, Select, Stack, useColorModeValue } from "@chakra-ui/react";

const ManageFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/feedback/getAll", { withCredentials: true });
                setFeedbacks(response.data);
                setFilteredFeedbacks(response.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchFeedbacks();

        const intervalId = setInterval(fetchFeedbacks, 5000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        let updatedFeedbacks = feedbacks;

        if (filter !== 'all') {
            updatedFeedbacks = updatedFeedbacks.filter(feedback => feedback.tip_feedback === filter);
        }

        setFilteredFeedbacks(updatedFeedbacks);
    }, [filter, feedbacks]);

    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate('/home');
    };

    const bg = useColorModeValue('gray.100', 'gray.700');

    return (
        <Box p={5} bg={bg} minH="100vh">
            <Heading mb={5}>Feedbacks</Heading>
            <Flex mb={5} justify="space-between">
                <Select value={filter} onChange={(e) => setFilter(e.target.value)} maxW="300px" border="1px solid gray">
                    <option value="all">All</option>
                    <option value="Task">Task</option>
                    <option value="Zi de lucru">Zi de lucru</option>
                </Select>
                <Button colorScheme="blue" onClick={handleGoBack}>Go back</Button>
            </Flex>
            <Box overflowY="auto" maxHeight="80vh">
                <Stack spacing={4}>
                    {filteredFeedbacks.map(feedback => (
                        <AdminFeedback key={feedback.id} feedback={feedback} />
                    ))}
                </Stack>
            </Box>
        </Box>
    );
}

export default ManageFeedback;
