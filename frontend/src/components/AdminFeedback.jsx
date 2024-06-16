import axios from "axios";
import { useEffect, useState } from "react";
import { Box, Text, Stack, Image, Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, useDisclosure, useColorModeValue } from "@chakra-ui/react";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { format } from 'date-fns';

const AdminFeedback = ({ feedback }) => {
    const [angajat, setAngajat] = useState({});
    const [task, setTask] = useState({});
    const { isOpen, onOpen, onClose } = useDisclosure();

    const bg = useColorModeValue('gray.300', 'gray.800');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/user/get/${feedback.idAngajat}`, { withCredentials: true });
                setAngajat(response.data);

                if (feedback.tip_feedback === "Task") {
                    const responseTask = await axios.get(`http://localhost:8080/api/task/get/${feedback.idTask}`, { withCredentials: true });
                    setTask(responseTask.data);
                }

            } catch (err) {
                console.log(err);
            }
        }

        fetchData();
    }, [feedback.idAngajat, feedback.idTask, feedback.tip_feedback]);

    const formattedDate = feedback.data ? format(new Date(feedback.data), 'dd/MM/yyyy HH:mm:ss') : '';

    return (
        <Box p={5} borderWidth="1px" borderRadius="lg" shadow="md" bg={bg}>
            <Flex direction={['column', 'column', 'row']} alignItems="center">
                <Stack spacing={3} flex="1">
                    <Text><strong>Tip feedback:</strong> {feedback.tip_feedback}</Text>
                    <Text><strong>Nota:</strong> {feedback.nota}</Text>
                    <Text><strong>Mesaj:</strong> {feedback.mesaj}</Text>
                    <Text><strong>Data:</strong> {formattedDate}</Text>
                    <Text><strong>Angajat:</strong> {angajat.nume}</Text>
                    {feedback.tip_feedback === "Task" && <Text><strong>Task:</strong> {task.titlu}</Text>}
                </Stack>
                {feedback.photoPath && (
                    <Box
                        flexShrink={0}
                        borderWidth="1px"
                        borderRadius="lg"
                        overflow="hidden"
                        ml={[0, 0, 5]}
                        mt={[5, 5, 0]}
                        onClick={onOpen}
                        cursor="pointer"
                        maxW="150px"
                        maxH="150px"
                    >
                        <Image src={`http://localhost:8080/${feedback.photoPath}`} alt="photo" objectFit="cover" w="100%" h="100%" />
                    </Box>
                )}
            </Flex>

            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Photo</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Zoom>
                            <Image src={`http://localhost:8080/${feedback.photoPath}`} alt="photo" w="100%" />
                        </Zoom>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}

export default AdminFeedback;
