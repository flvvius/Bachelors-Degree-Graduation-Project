import { useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    Textarea,
    useColorModeValue
} from '@chakra-ui/react';

const UploadTask = ({ users, onSubmit }) => {
    const [formData, setFormData] = useState({
        titlu: "",
        descriere: "",
        deadline: "",
        importanta: "",
        userIds: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleUserSelect = (e) => {
        const options = e.target.options;
        const selectedUserIds = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedUserIds.push(options[i].value);
            }
        }
        setFormData({
            ...formData,
            userIds: selectedUserIds
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Box
            p={5}
            borderWidth="1px"
            borderRadius="lg"
            bg={useColorModeValue('white', 'gray.800')}
            shadow="md"
            maxWidth="600px"
            margin="auto"
        >
            <form onSubmit={handleSubmit}>
                <FormControl mb={4}>
                    <FormLabel htmlFor="titlu">Titlu</FormLabel>
                    <Input
                        type="text"
                        id="titlu"
                        name="titlu"
                        value={formData.titlu}
                        onChange={handleChange}
                    />
                </FormControl>
                <FormControl mb={4}>
                    <FormLabel htmlFor="descriere">Descriere</FormLabel>
                    <Textarea
                        id="descriere"
                        name="descriere"
                        value={formData.descriere}
                        onChange={handleChange}
                    />
                </FormControl>
                <FormControl mb={4}>
                    <FormLabel htmlFor="deadline">Deadline</FormLabel>
                    <Input
                        type="datetime-local"
                        id="deadline"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                    />
                </FormControl>
                <FormControl mb={4}>
                    <FormLabel htmlFor="importanta">Importanță</FormLabel>
                    <Select
                        id="importanta"
                        name="importanta"
                        value={formData.importanta}
                        onChange={handleChange}
                    >
                        <option value="">Selectează importanța</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </Select>
                </FormControl>
                <FormControl mb={4}>
                    <FormLabel htmlFor="userIds">User IDs</FormLabel>
                    <Select
                        id="userIds"
                        name="userIds"
                        multiple
                        value={formData.userIds}
                        onChange={handleUserSelect}
                        size="md"
                    >
                        {users.map((user) => (
                            user.apartineFirmei && (
                                <option key={user.id} value={user.id}>
                                    {user.nume}
                                </option>
                            )
                        ))}
                    </Select>
                </FormControl>
                <Button type="submit" colorScheme="teal" width="full">
                    Submit
                </Button>
            </form>
        </Box>
    );
};

export default UploadTask;
