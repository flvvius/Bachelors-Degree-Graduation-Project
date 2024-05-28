import axios from "axios";
import { useEffect, useState } from "react";
import AdminFeedback from "../components/AdminFeedback";
import { useNavigate } from "react-router-dom";
import { Box, Button, Heading, Stack } from "@chakra-ui/react";

const ManageFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/feedback/getAll", { withCredentials: true });
                setFeedbacks(response.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();

        const intervalId = setInterval(fetchData, 5000);

        return () => clearInterval(intervalId);
    }, []);

    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate('/home');
    };

    return (
        <Box p={5}>
            <Heading mb={5}>Feedbacks</Heading>
                <Box overflowY="auto" maxHeight="80vh">
                    <Stack spacing={4}>
                        {feedbacks.map(feedback => (
                            <AdminFeedback key={feedback.id} feedback={feedback} />
                        ))}
                    </Stack>
                </Box>
            <Button mt={5} colorScheme="teal" onClick={handleGoBack}>Go back</Button>
        </Box>
    );
}

export default ManageFeedback;
