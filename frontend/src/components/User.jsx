import axios from "axios";
import { useEffect, useState } from "react";
import AddBonus from "./AddBonus";
import {
    Box,
    Button,
    Heading,
    Stack,
    Text,
    useColorModeValue,
    VStack,
    FormControl,
    FormLabel,
    Select,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    useDisclosure
} from "@chakra-ui/react";

const User = ({ user }) => {
    const [role, setRole] = useState(user.esteAdmin ? "admin" : user.apartineFirmei ? "angajat" : "none");
    const [updatedUser, setUpdatedUser] = useState({
        id: user.id,
        mail: user.mail,
        nume: user.nume,
        esteAdmin: user.esteAdmin,
        apartineFirmei: user.apartineFirmei,
        cuantificareTimp: user.cuantificareTimp
    });
    const [showModal, setShowModal] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleRoleChange = async (event) => {
        const newRole = event.target.value;
        setRole(newRole);

        const updatedUserData = {
            ...updatedUser,
            esteAdmin: newRole === "admin",
            apartineFirmei: newRole === "angajat",
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

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

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
                <Text>
                    {user.cuantificareTimp >= 0 ? (
                        <>
                        worked extra <Text as="span" fontWeight="bold" color="tan">{formatTime(Math.floor(user.cuantificareTimp))}</Text>
                        </>
                    ) : (
                        <>
                        worked <Text as="span" fontWeight="bold" color="tan">{formatTime(Math.abs(Math.floor(user.cuantificareTimp)))}</Text> less than expected
                        </>
                    )}
                </Text>
                <FormControl>
                    <FormLabel>Roles</FormLabel>
                    <Select value={role} onChange={handleRoleChange}>
                        <option value="admin">Este admin</option>
                        <option value="angajat">Este angajat</option>
                        <option value="none">None</option>
                    </Select>
                </FormControl>
                <Stack direction={{ base: 'column', md: 'row' }} spacing={4} w="100%">
                    <Button colorScheme="teal" onClick={handleOpenModal} w="full">
                        Acorda bonus
                    </Button>
                    <Button colorScheme="red" onClick={onOpen} w="full">
                        Sterge utilizator
                    </Button>
                </Stack>
            </VStack>
            <AddBonus show={showModal} onClose={handleCloseModal} userId={user.id} />

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirmare Stergere</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>Sunteti sigur ca doriti sa stergeti acest utilizator?</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" mr={3} onClick={handleDelete}>
                            Sterge
                        </Button>
                        <Button variant="ghost" onClick={onClose}>Anuleaza</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default User;
