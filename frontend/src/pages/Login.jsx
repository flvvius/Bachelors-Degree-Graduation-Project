import { Box, Button, Heading, Image } from "@chakra-ui/react";
import googleImg from '../assets/google.jpg'

export default function Login() {
    const googleAuth = async (e) => {
        e.preventDefault();
        await window.open(`http://localhost:8080/api/auth/`, "_self");
    };

    return (
        <Box p={5} display="flex" flexDirection="column" alignItems="center" justifyContent="center" minH="100vh">
            <Heading mb={5}>Log in Form</Heading>
            <Box p={5} borderWidth="1px" borderRadius="lg" shadow="md">
                <Button colorScheme="teal" onClick={googleAuth} display="flex" alignItems="center">
                    <Image src={googleImg} alt="google icon" boxSize="24px" mr={3} />
                    <span>Sign in with Google</span>
                </Button>
            </Box>
        </Box>
    );
}
