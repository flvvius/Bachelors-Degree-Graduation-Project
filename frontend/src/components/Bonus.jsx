import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { format } from 'date-fns';

const Bonus = ({ user, bonus }) => {
    const bg = useColorModeValue("gray.300", "gray.800");

    const formattedDate = bonus.data ? format(new Date(bonus.data), 'dd/MM/yyyy') : 'N/A';

    return (
        <Box p={4} borderWidth="1px" borderRadius="lg" shadow="md" bg={bg}>
            <Text fontSize="md" fontWeight="bold">Cuantum: {bonus.cuantum_bonus}</Text>
            <Text fontSize="md">Descriere: {bonus.descriere_bonus}</Text>
            <Text fontSize="md">Data: {formattedDate}</Text>
        </Box>
    );
}

export default Bonus;
