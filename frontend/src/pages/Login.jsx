import { Box, Button, Heading, Image, VStack, Text, useColorModeValue, Flex } from "@chakra-ui/react";
import googleImg from '../assets/google.png';

export default function Login() {
    const googleAuth = async (e) => {
        e.preventDefault();
        await window.open(`http://localhost:8080/api/auth/`, "_self");
    };

    const bg = useColorModeValue("white", "gray.700");
    const boxShadow = useColorModeValue("lg", "dark-lg");

    return (
        <Box p={5} display="flex" flexDirection="column" alignItems="center" justifyContent="center" minH="100vh" bg={useColorModeValue("gray.200", "gray.800")}>
            <Flex flexDirection="column" alignItems="center" justifyContent="center" p={8} borderWidth="1px" borderRadius="lg" shadow={boxShadow} bg={bg} maxW="sm" width="100%" minW="50vw" minH="40vh">

                <Heading mb={5} color={useColorModeValue("blue.600", "blue.300")} marginBottom="39">Welcome!</Heading>
                <Text fontSize="lg" mb={5} textAlign="center" color={useColorModeValue("gray.600", "gray.200")}>
                    Please sign in to continue
                </Text>

                <VStack spacing={5}>
                    <Button colorScheme="blue" variant="outline" onClick={googleAuth} display="flex" alignItems="center" width="100%" minH="6vh">
                        <Image src={googleImg} alt="google icon" boxSize="24px" mr={3} />
                        <span>Sign in with Google</span>
                    </Button>
                </VStack>
            </Flex>
        </Box>
    );
}
