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
    Radio,
    RadioGroup,
    Stack,
    Textarea,
} from "@chakra-ui/react";

const AddBonus = ({ show, onClose, userId }) => {
    const [formData, setFormData] = useState({
        cuantum_bonus: 0,
        descriere_bonus: "",
        aplicat: false,
        idUser: userId,
    });

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
        } catch (error) {
            console.error(error);
        }
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
                                required
                            />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Aplicat:</FormLabel>
                            <RadioGroup onChange={handleRadioChange} value={String(formData.aplicat)}>
                                <Stack direction="row">
                                    <Radio value="true">Da</Radio>
                                    <Radio value="false">Nu</Radio>
                                </Stack>
                            </RadioGroup>
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
