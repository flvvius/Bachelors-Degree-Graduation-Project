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
import { format, toDate, formatInTimeZone } from 'date-fns-tz';

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
    const [pauseTime, setPauseTime] = useState(0); // Time when pause started
    const [totalPausedDuration, setTotalPausedDuration] = useState(0); // Total time spent paused
    const toast = useToast();

    const totalWorkTime = 8 * 60 * 60 * 1000;
    const timeZone = 'Europe/Bucharest';

    useEffect(() => {
        const savedCheckInDate = localStorage.getItem('checkInDate');
        const savedElapsedTime = localStorage.getItem('elapsedTime');
        const savedIsPaused = localStorage.getItem('isPaused');
        const savedPauseTime = localStorage.getItem('pauseTime');
        const savedTotalPausedDuration = localStorage.getItem('totalPausedDuration');

        if (savedCheckInDate) {
            const checkInDate = new Date(savedCheckInDate);
            setCheckInDate(checkInDate);

            if (savedElapsedTime) {
                setElapsedTime(parseInt(savedElapsedTime, 10));
            }

            if (savedIsPaused) {
                setIsPaused(savedIsPaused === 'true');
            }

            if (savedPauseTime) {
                setPauseTime(parseInt(savedPauseTime, 10));
            }

            if (savedTotalPausedDuration) {
                setTotalPausedDuration(parseInt(savedTotalPausedDuration, 10));
            }
        }
    }, []);

    useEffect(() => {
        let interval = null;
        if (checkInDate && !isPaused) {
            interval = setInterval(() => {
                const currentTime = new Date().getTime();
                const startTime = new Date(checkInDate).getTime();
                const newElapsedTime = currentTime - startTime - totalPausedDuration;
                setElapsedTime(newElapsedTime);
                localStorage.setItem('elapsedTime', newElapsedTime.toString());
            }, 1000);
        } else if (isPaused || !checkInDate) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [checkInDate, isPaused, totalPausedDuration]);

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
        const zonedDate = toDate(date, { timeZone });
        return formatInTimeZone(zonedDate, timeZone, 'MM/dd/yyyy HH:mm:ss');
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
    
        try {
            const currentDate = new Date();
            const updatedPontaj = {
                ...pontaj,
                check_in: checkInDate,
                check_out: currentDate
            };
    
            await axios.put(`http://localhost:8080/api/user/update/${updatedUser.id}`, updatedUser, { withCredentials: true });
            axios.defaults.withCredentials = true;
    
            setPontaj(updatedPontaj);
            setCheckOutDate(currentDate);
            localStorage.removeItem('checkInDate');
            localStorage.removeItem('elapsedTime');
            localStorage.removeItem('isPaused');
            localStorage.removeItem('pauseTime');
            localStorage.removeItem('totalPausedDuration');
    
            const response = await axios.post("http://localhost:8080/api/pontaj/add", updatedPontaj, { withCredentials: true });
            console.log(response);
            if (response.status === 200) {
                toast({
                    title: "Checked out successfully",
                    description: "Your check-out has been recorded.",
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                    position: 'top-right'
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Check-out failed",
                description: "There was an error checking out. Please try again.",
                status: 'error',
                duration: 9000,
                isClosable: true,
                position: 'top-right'
            });
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
        const currentTime = new Date().getTime();

        if (isPaused) {
            const pausedDuration = currentTime - pauseTime;
            setTotalPausedDuration(prev => prev + pausedDuration);
            localStorage.setItem('totalPausedDuration', (totalPausedDuration + pausedDuration).toString());
            setPauseTime(0);
            localStorage.removeItem('pauseTime');
        } else {
            setPauseTime(currentTime);
            localStorage.setItem('pauseTime', currentTime.toString());
        }

        setIsPaused(prevIsPaused => !prevIsPaused);
        localStorage.setItem('isPaused', (!isPaused).toString());
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
                    {checkInDate && !checkOutDate && <Button colorScheme={isPaused ? "blue" : "red"} onClick={handlePauseResume} mt={2}>
                        {isPaused ? 'Resume' : 'Pause'}
                    </Button>}
                </Flex>

                <Box mb={4}>
                    {checkInDate && <Text><strong>Check-In Date: {formatDate(checkInDate)}</strong></Text>}
                    {checkOutDate && <Text><strong>Check-Out Date: {formatDate(checkOutDate)}</strong></Text>}
                </Box>

                {checkInDate && !checkOutDate && (
                    <Box>
                        <Text><strong>Elapsed Time: {formatTime(Math.floor(elapsedTime / 1000))}</strong></Text>
                        <Text><strong>Remaining Time: {formatTime(Math.floor(remainingTime / 1000))}</strong></Text>
                        <Box mt={4}>
                            <CircularProgress value={percentage} color='green.500' size="120px">
                                <CircularProgressLabel>{`${percentage}%`}</CircularProgressLabel>
                            </CircularProgress>
                        </Box>
                    </Box>
                )}

                <Box mt={4}>
                    <Text>
                        <strong>
                            {user.cuantificareTimp >= 0 ? (
                                <>
                                    You worked <Text as="span" color="green.500">extra</Text> {formatTime(Math.floor(user.cuantificareTimp))}
                                </>
                            ) : (
                                <>
                                    You worked {formatTime(Math.abs(Math.floor(user.cuantificareTimp)))} <Text as="span" color="red.500">less</Text>
                                </>
                            )}
                        </strong>
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
