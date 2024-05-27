import axios from "axios";
import { useEffect, useState } from "react";
import AddBonus from "./AddBonus";
import {
    Box,
    Button,
    Checkbox,
    Heading,
    Stack,
    Text,
    useColorModeValue,
    VStack,
    HStack,
    FormControl,
    FormLabel
} from "@chakra-ui/react";

const User = ({ user }) => {
    const [checkedAdmin, setCheckedAdmin] = useState(user.esteAdmin);
    const [checkedAngajat, setCheckedAngajat] = useState(user.apartineFirmei);
    const [updatedUser, setUpdatedUser] = useState({
        id: user.id,
        mail: user.mail,
        nume: user.nume,
        esteAdmin: user.esteAdmin,
        apartineFirmei: user.apartineFirmei,
    });
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        setUpdatedUser((prevUser) => ({
            ...prevUser,
            esteAdmin: checkedAdmin,
        }));
    }, [checkedAdmin]);

    const handleAdminCheck = async () => {
        const newCheckedAdmin = !checkedAdmin;
        setCheckedAdmin(newCheckedAdmin);

        const updatedUserData = {
            ...updatedUser,
            esteAdmin: newCheckedAdmin,
        };

        try {
            await axios.put(`http://localhost:8080/api/user/update/${user.id}`, updatedUserData, { withCredentials: true });
            setUpdatedUser(updatedUserData);
        } catch (err) {
            console.log(err);
        }
    };

    const handleAngajatCheck = async () => {
        const newCheckedAngajat = !checkedAngajat;
        setCheckedAngajat(newCheckedAngajat);

        const updatedUserData = {
            ...updatedUser,
            apartineFirmei: newCheckedAngajat,
        };

        try {
            await axios.put(`http://localhost:8080/api/user/update/${user.id}`, updatedUserData, { withCredentials: true });
            setUpdatedUser(updatedUserData);
        } catch (err) {
            console.log(err);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/user/delete/${user.id}`, { withCredentials: true });
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const adminBgColor = useColorModeValue('teal.100', 'teal.900');
    const userBgColor = useColorModeValue('white', 'gray.800');
    const nameColor = useColorModeValue('teal.600', 'teal.200');

    return (
        <Box
            p={5}
            mb={5}
            borderWidth="1px"
            borderRadius="lg"
            bg={updatedUser.esteAdmin ? adminBgColor : userBgColor}
            shadow="md"
            w="80%"
        >
            <VStack align="start" spacing={4}>
                <Heading as="h3" size="md" color={nameColor}>
                    {user.nume}
                </Heading>
                <Text>{user.mail}</Text>
                <FormControl>
                    <FormLabel>Roles</FormLabel>
                    <HStack spacing={4}>
                        <Checkbox 
                            isChecked={checkedAdmin} 
                            onChange={handleAdminCheck} 
                            colorScheme="teal"
                        >
                            Este admin
                        </Checkbox>
                        <Checkbox 
                            isChecked={checkedAngajat} 
                            onChange={handleAngajatCheck} 
                            colorScheme="teal"
                        >
                            Este angajat
                        </Checkbox>
                    </HStack>
                </FormControl>
                <Stack direction={{ base: 'column', md: 'row' }} spacing={4} w="100%">
                    <Button colorScheme="teal" onClick={handleOpenModal} w="full">
                        Acorda bonus
                    </Button>
                    <Button colorScheme="red" onClick={handleDelete} w="full">
                        Sterge utilizator
                    </Button>
                </Stack>
            </VStack>
            <AddBonus show={showModal} onClose={handleCloseModal} userId={user.id} />
        </Box>
    );
};

export default User;
