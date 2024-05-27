import { Box } from "@chakra-ui/react";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <Box>
      <Navbar />
      <Box p={4}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
