import React, { useState } from 'react';
import axios from 'axios';
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Textarea,
    useToast,
} from "@chakra-ui/react";

const AddBonus = ({ show, onClose, userId }) => {
    const [formData, setFormData] = useState({
        cuantum_bonus: 0,
        descriere_bonus: "",
        data: new Date(),
        idUser: userId,
    });

    const toast = useToast();

    if (!show) {
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/bonus/add', formData);
            onClose();
            return toast({
                title: "Success",
                description: "You successfully added the bonus!",
                status: 'success',
                duration: 9000,
                isClosable: true,
                position: 'top-right'
            });
        } catch (error) {
            if (error.response && error.response.data) {
                console.error(error.response.data.message);
                return toast({
                    title: "Negative bonus",
                    description: "The value of your bonus must be positive!",
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                    position: 'top-right'
                });
            } else {
                console.error(error.message);
            }        }
    };

    const handleRadioChange = (value) => {
        setFormData((prevData) => ({
            ...prevData,
            aplicat: value === "true"
        }));
    };

    return (
        <Modal isOpen={show} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Acorda Bonus</ModalHeader>
                <ModalCloseButton />
                <form onSubmit={handleSubmit}>
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel htmlFor="cuantum_bonus">Cuantum bonus:</FormLabel>
                            <Input
                                type="number"
                                id="cuantum_bonus"
                                name="cuantum_bonus"
                                value={formData.cuantum_bonus}
                                onChange={handleChange}
                                required
                            />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel htmlFor="descriere_bonus">Descriere bonus:</FormLabel>
                            <Textarea
                                id="descriere_bonus"
                                name="descriere_bonus"
                                value={formData.descriere_bonus}
                                onChange={handleChange}
                            />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} type="submit">
                            Submit
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};

export default AddBonus;
