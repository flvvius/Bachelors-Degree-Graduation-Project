import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    Heading,
    Text,
    useToast,
    CircularProgress,
    CircularProgressLabel,
    Flex,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    useColorModeValue
} from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';

const Pontaj = () => {
    const { user, setUser } = useAuth();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const currentDate = new Date();
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [pontaj, setPontaj] = useState({
        data: currentDate,
        check_in: null,
        check_out: null,
        idUser: user.id
    });
    const [isPaused, setIsPaused] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const toast = useToast();

    const totalWorkTime = 8 * 60 * 60 * 1000;

    useEffect(() => {
        const savedCheckInDate = localStorage.getItem('checkInDate');
        if (savedCheckInDate) {
            const checkInDate = new Date(savedCheckInDate);
            setCheckInDate(checkInDate);
            const currentTime = new Date().getTime();
            const elapsedTime = currentTime - checkInDate.getTime();
            setElapsedTime(elapsedTime);
        }
    }, []);

    useEffect(() => {
        let interval = null;
        if (checkInDate && !isPaused) {
            interval = setInterval(() => {
                setElapsedTime(prevElapsedTime => prevElapsedTime + 1000);
            }, 1000);
        } else if (isPaused || !checkInDate) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [checkInDate, isPaused]);

    useEffect(() => {
        if (elapsedTime >= totalWorkTime) {
            handleCheckOut();
        }
    }, [elapsedTime]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/pontaj/getPontajByData/${user.id}`, { withCredentials: true });

                if (response.data) {
                    const pontajData = response.data;
                    setPontaj(pontajData);
                    setCheckInDate(pontajData.check_in ? new Date(pontajData.check_in) : null);
                    setCheckOutDate(pontajData.check_out ? new Date(pontajData.check_out) : null);
                }

            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, [user.id]);

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
            return toast({
                title: "You can't check-in",
                description: "You already checked-in earlier!",
                status: 'error',
                duration: 9000,
                isClosable: true,
                position: 'top-right'
            });
        }

        const currentDate = new Date();
        localStorage.setItem('checkInDate', currentDate.toISOString());

        setPontaj((prevPontaj) => ({
            ...prevPontaj,
            check_in: currentDate
        }));
        setCheckInDate(currentDate);
    };

    const handleCheckOut = async () => {
        if (checkOutDate != null) {
            return toast({
                title: "You can't check-out",
                description: "You already checked-out earlier!",
                status: 'error',
                duration: 9000,
                isClosable: true,
                position: 'top-right'
            });
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

        const overtime = (elapsedTime - totalWorkTime) / 1000;
        const timp = user.cuantificareTimp ? user.cuantificareTimp + overtime : overtime;
        const updatedUser = {
            ...user,
            cuantificareTimp: timp
        };
        setUser(updatedUser);

        await axios.put(`http://localhost:8080/api/user/update/${updatedUser.id}`, updatedUser, { withCredentials: true });
        axios.defaults.withCredentials = true;

        const currentDate = new Date();
        const updatedPontaj = {
            ...pontaj,
            check_out: currentDate
        };

        setPontaj(updatedPontaj);
        setCheckOutDate(currentDate);
        localStorage.removeItem('checkInDate');

        try {
            const response = await axios.post("http://localhost:8080/api/pontaj/add", updatedPontaj, { withCredentials: true });
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCheckOutClick = () => {
        onOpen();
    };

    const handleConfirmCheckOut = async () => {
        onClose();
        await handleCheckOut();
    };

    const handlePauseResume = () => {
        setIsPaused(prevIsPaused => !prevIsPaused);
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    const remainingTime = Math.max(totalWorkTime - elapsedTime, 0);
    const percentage = ((elapsedTime / totalWorkTime) * 100).toFixed(2);

    const bg = useColorModeValue("gray.300", "gray.800");
    const btnColor = useColorModeValue("blue", "blue");

    return (
        <Box bg={bg} borderRadius={8} shadow="lg" padding={25}>
            <Heading mb={4} ml={2}>Pontaj</Heading>

            <Flex justify="space-around" align="center" wrap="wrap">
                <Flex justify="space-around" flexDirection="column" mr={4}>
                    <Button colorScheme={btnColor} onClick={handleCheckIn} mt={2}>
                        Check-In
                    </Button>
                    <Button colorScheme={btnColor} onClick={handleCheckOutClick} mt={2}>
                        Check-Out
                    </Button>
                    {checkInDate && !checkOutDate && <Button colorScheme={isPaused ? {btnColor} : "red"} onClick={handlePauseResume} mt={2}>
                        {isPaused ? 'Resume' : 'Pause'}
                    </Button>}
                </Flex>

                <Box mb={4}>
                    {checkInDate && <Text>Check-In Date: {formatDate(checkInDate)}</Text>}
                    {checkOutDate && <Text>Check-Out Date: {formatDate(checkOutDate)}</Text>}
                </Box>

                {checkInDate && !checkOutDate && (
                    <Box>
                        <Text>Elapsed Time: {formatTime(Math.floor(elapsedTime / 1000))}</Text>
                        <Text>Remaining Time: {formatTime(Math.floor(remainingTime / 1000))}</Text>
                        <Box mt={4}>
                            <CircularProgress value={percentage} color='green.500' size="120px">
                                <CircularProgressLabel>{`${percentage}%`}</CircularProgressLabel>
                            </CircularProgress>
                        </Box>
                    </Box>
                )}

                <Box mt={4}>
                    <Text>
                        {user.cuantificareTimp >= 0 ? `You worked extra ${formatTime(Math.floor(user.cuantificareTimp))}` : `You worked ${formatTime(Math.abs(Math.floor(user.cuantificareTimp)))} less`}
                    </Text>
                </Box>
            </Flex>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirm Check-Out</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>Are you sure you want to check out?</Text>
                        {!checkOutDate && <Text>You are <strong>{formatTime(Math.floor(remainingTime / 1000))}</strong> away from reaching the daily routine!</Text>}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme={btnColor} mr={3} onClick={handleConfirmCheckOut}>
                            Yes
                        </Button>
                        <Button variant="ghost" onClick={onClose}>No</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default Pontaj;
