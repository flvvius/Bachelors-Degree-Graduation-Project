import { Box, Text, useColorModeValue } from "@chakra-ui/react";

const Bonus = ({ user, bonus }) => {

    const bg = useColorModeValue("gray.300", "gray.800")

    return (
        <Box p={4} borderWidth="1px" borderRadius="lg" shadow="md" bg={bg}>
            <Text fontSize="md" fontWeight="bold">Cuantum: {bonus.cuantum_bonus}</Text>
            <Text fontSize="md">Descriere: {bonus.descriere_bonus}</Text>
            <Text fontSize="md">A fost aplicat deja: {bonus.aplicat ? "DA" : "NU"}</Text>
        </Box>
    );
}

export default Bonus;
