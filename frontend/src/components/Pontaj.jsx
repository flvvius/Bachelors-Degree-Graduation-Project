import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Heading, Text, useToast } from '@chakra-ui/react';

const Pontaj = ({ userId }) => {
    const currentDate = new Date();
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [pontaj, setPontaj] = useState({
        data: currentDate,
        check_in: null,
        check_out: null,
        idUser: userId
    });
    const toast = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/pontaj/getPontajByData/${userId}`, { withCredentials: true });

                if (response.data) {
                    setPontaj(response.data);
                    setCheckInDate(response.data.check_in);
                    setCheckOutDate(response.data.check_out);
                }

            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, [userId]);

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const handleCheckIn = () => {
        if (checkInDate != null) {
            return;
        }

        const currentDate = new Date();

        setPontaj((prevPontaj) => ({
            ...prevPontaj,
            check_in: currentDate
        }));
        setCheckInDate(formatDate(currentDate));
    };

    const handleCheckOut = async () => {
        if (checkOutDate != null) {
            return;
        }

        if (checkInDate == null) {
            return toast({
                title: "You can't check-out",
                description: "You have to first check-in in order to check-out.",
                status: 'error',
                duration: 9000,
                isClosable: true,
                position: 'top-right'
            });
        }

        const currentDate = new Date();
        const updatedPontaj = {
            ...pontaj,
            check_out: currentDate
        };

        setPontaj(updatedPontaj);
        setCheckOutDate(formatDate(currentDate));

        try {
            const response = await axios.post("http://localhost:8080/api/pontaj/add", updatedPontaj, { withCredentials: true });
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Box>
            <Heading mb={4}>Pontaj</Heading>

            <Box mb={4}>
                {checkInDate && <Text>Check-In Date: {checkInDate}</Text>}
                <Button colorScheme="teal" onClick={handleCheckIn} mt={2}>
                    Check-In
                </Button>
            </Box>

            <Box>
                {checkOutDate && <Text>Check-Out Date: {checkOutDate}</Text>}
                <Button colorScheme="teal" onClick={handleCheckOut} mt={2}>
                    Check-Out
                </Button>
            </Box>
        </Box>
    );
}

export default Pontaj;
