import React, { useState } from 'react';
import {Button, FormControl, FormLabel, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Textarea } from '@chakra-ui/react';
import axios from 'axios';

const UserFeedback = ({ show, onClose, userId, taskId }) => {
    const tipFeedback = taskId == null ? "Zi de lucru" : "Task";

    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        tip_feedback: tipFeedback,
        nota: 0,
        mesaj: "",
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
        } catch (error) {
            console.error(error);
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

                        <Button type="submit" colorScheme="teal" mr={3}>
                            Submit
                        </Button>
                        <Button onClick={onClose}>
                            Cancel
                        </Button>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default UserFeedback;
