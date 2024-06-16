import React, { useState } from 'react';
import {Button, FormControl, FormLabel, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Textarea, useToast } from '@chakra-ui/react';
import axios from 'axios';

const UserFeedback = ({ show, onClose, userId, taskId }) => {
    const tipFeedback = taskId === null ? "Zi de lucru" : "Task";

    const toast = useToast();

    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        tip_feedback: tipFeedback,
        nota: '',
        mesaj: "",
        data: new Date().toISOString(),
        idAngajat: userId,
        idTask: taskId
    });

    if (!show) {
        return null;
    }

    const onFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('photo', file);
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        try {
            await axios.post('http://localhost:8080/api/feedback/add', data, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
            });
            onClose();
            toast({
                title: "Success",
                description: `You successfully rated this ${formData.tip_feedback === "Task" ? "task" : "working day"}!`,
                status: 'success',
                duration: 9000,
                isClosable: true,
                position: 'top-right'
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Invalid rating",
                description: "You have to pick a rating from 1 to 10!",
                status: 'error',
                duration: 9000,
                isClosable: true,
                position: 'top-right'
            });
        }
    };

    return (
        <Modal isOpen={show} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Acorda feedback pentru {tipFeedback}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={handleSubmit}>
                        <FormControl mb={4}>
                            <FormLabel htmlFor="tip_feedback">Tip feedback</FormLabel>
                            <Input
                                type="text"
                                id="tip_feedback"
                                name="tip_feedback"
                                value={tipFeedback}
                                readOnly
                            />
                        </FormControl>

                        <FormControl mb={4}>
                            <FormLabel htmlFor="nota">Nota</FormLabel>
                            <Input
                                type="number"
                                id="nota"
                                name="nota"
                                value={formData.nota}
                                onChange={handleChange}
                                min="1"
                                max="10"
                                required
                            />
                        </FormControl>

                        <FormControl mb={4}>
                            <FormLabel htmlFor="mesaj">Mesaj</FormLabel>
                            <Textarea
                                id="mesaj"
                                name="mesaj"
                                value={formData.mesaj}
                                onChange={handleChange}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel htmlFor='photo'>Upload photo</FormLabel>
                            <Input 
                                type='file'
                                id='photo'
                                name='photo'
                                onChange={onFileChange}
                            />
                        </FormControl>

                        <Button type="submit" colorScheme="blue" mr={3} mt={4}>
                            Submit
                        </Button>
                        <Button onClick={onClose} mt={4}>
                            Cancel
                        </Button>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default UserFeedback;
