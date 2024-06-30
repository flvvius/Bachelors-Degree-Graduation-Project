import { useEffect, useState } from "react";
import axios from 'axios';
import { Box, Select, Text, VStack, HStack, Flex } from "@chakra-ui/react";

const CalculPontaj = () => {
    const [users, setUsers] = useState([]);
    const [pontaje, setPontaje] = useState({});
    const [selectedUser, setSelectedUser] = useState(null);
    const [medieCheckIn, setMedieCheckIn] = useState({});
    const [medieCheckOut, setMedieCheckOut] = useState({});
    const [overallCheckIn, setOverallCheckIn] = useState(null);
    const [overallCheckOut, setOverallCheckOut] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/user/getAllAngajati");
                setUsers(response.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const fetchPontaje = async () => {
            if (users.length === 0) return;

            try {
                const pontajePromises = users.map(user =>
                    axios.get(`http://localhost:8080/api/pontaj/get/${user.id}`)
                );

                const pontajeResponses = await Promise.all(pontajePromises);
                const pontajeData = {};
                pontajeResponses.forEach((res, index) => {
                    pontajeData[users[index].id] = res.data;
                });
                setPontaje(pontajeData);
            } catch (err) {
                console.log(err);
            }
        };

        fetchPontaje();
    }, [users]);

    useEffect(() => {
        if (Object.keys(pontaje).length === 0) return;

        const calculateAverageTime = (times) => {
            if (times.length === 0) return null;

            const totalSeconds = times.reduce((acc, time) => {
                const date = new Date(time);
                const seconds = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
                return acc + seconds;
            }, 0);

            const averageSeconds = totalSeconds / times.length;

            const hours = Math.floor(averageSeconds / 3600);
            const minutes = Math.floor((averageSeconds % 3600) / 60);
            const seconds = Math.floor(averageSeconds % 60);

            return new Date(1970, 0, 1, hours, minutes, seconds);
        };

        const mediePontajeCheckIn = {};
        const mediePontajeCheckOut = {};

        users.forEach(user => {
            const userPontaje = pontaje[user.id] || [];
            const validCheckIns = userPontaje.filter(pontaj => pontaj.check_in).map(pontaj => pontaj.check_in);
            mediePontajeCheckIn[user.id] = calculateAverageTime(validCheckIns);

            const validCheckOuts = userPontaje.filter(pontaj => pontaj.check_out).map(pontaj => pontaj.check_out);
            mediePontajeCheckOut[user.id] = calculateAverageTime(validCheckOuts);
        });

        setMedieCheckIn(mediePontajeCheckIn);
        setMedieCheckOut(mediePontajeCheckOut);

        const validMedieCheckIns = Object.values(mediePontajeCheckIn).filter(time => time !== null).map(time => time.getTime());
        if (validMedieCheckIns.length > 0) {
            const meanOfMeansCheckIn = validMedieCheckIns.reduce((acc, time) => acc + time, 0) / validMedieCheckIns.length;
            setOverallCheckIn(new Date(meanOfMeansCheckIn));
        } else {
            setOverallCheckIn(null);
        }

        const validMedieCheckOuts = Object.values(mediePontajeCheckOut).filter(time => time !== null).map(time => time.getTime());
        if (validMedieCheckOuts.length > 0) {
            const meanOfMeansCheckOut = validMedieCheckOuts.reduce((acc, time) => acc + time, 0) / validMedieCheckOuts.length;
            setOverallCheckOut(new Date(meanOfMeansCheckOut));
        } else {
            setOverallCheckOut(null);
        }
    }, [pontaje, users]);

    const handleUserChange = (event) => {
        const userId = event.target.value;
        setSelectedUser(userId);
    };

    const formatDate = (date) => {
        if (!date) return "N/A";
        return date.toLocaleTimeString();
    };

    return (
        <Box p={5}>
            <Text fontSize="xx-large" textAlign="center" marginBottom={30}>Pontaj averages</Text>
            <Flex justify="space-between" alignItems="center" width="100%">
                <Box flex="1" mr={4}>
                    <VStack spacing={3}>
                        <Text fontSize="xl"><strong>Overall Averages</strong></Text>
                        <Text><strong>Overall Average Check-In:</strong> {formatDate(overallCheckIn)}</Text>
                        <Text><strong>Overall Average Check-Out:</strong> {formatDate(overallCheckOut)}</Text>
                    </VStack>
                </Box>
                <Box flex="1">
                    <VStack spacing={3}>
                        <Select placeholder="Select user" onChange={handleUserChange}>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.nume}
                                </option>
                            ))}
                        </Select>
                        {selectedUser !== null && (
                            <VStack spacing={3}>
                                <Text fontSize="xl"><strong>Averages for {users.find(user => user.id === parseInt(selectedUser)).nume}</strong></Text>
                                <Text><strong>Average Check-In:</strong> {formatDate(medieCheckIn[selectedUser])}</Text>
                                <Text><strong>Average Check-Out:</strong> {formatDate(medieCheckOut[selectedUser])}</Text>
                            </VStack>
                        )}
                    </VStack>
                </Box>
            </Flex>
        </Box>
    );
};

export default CalculPontaj;
