import React, { useState } from 'react';
import {
  Box,
  Button,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChevronRightIcon } from '@chakra-ui/icons';
import { motion } from "framer-motion";
import { Link as ScrollLink, animateScroll as scroll } from 'react-scroll';

const Sidebar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const buttonBg = useColorModeValue("blue.500", "blue.300");
  const buttonHoverBg = useColorModeValue("blue.300", "blue.500");
  const bgColor = useColorModeValue("whibluepha.900", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");

  return (
    <motion.div
      initial={{ width: "50px" }}
      animate={{ width: isHovered ? "200px" : "50px" }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        position: "fixed",
        top: "50%",
        left: 0,
        transform: "translateY(-50%)",
        zIndex: 1000,
        backgroundColor: bgColor,
        borderRadius: "0 50px 50px 0",
        overflow: "hidden",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)"
      }}
    >
      {isHovered ? (
        <VStack spacing={4} align="start" p={4} color={textColor}>
          <ScrollLink to="start" smooth={true} duration={500} offset={-70}>
            <Button w="100%" colorScheme="blue">Statistics</Button>
          </ScrollLink>
          <ScrollLink to="pie-charts" smooth={true} duration={500} offset={-70}>
            <Button w="100%" colorScheme="blue">Pie Charts</Button>
          </ScrollLink>
          <ScrollLink to="bar-charts-1" smooth={true} duration={500} offset={-70}>
            <Button w="100%" colorScheme="blue">Bar Charts</Button>
          </ScrollLink>
          <ScrollLink to="report" smooth={true} duration={500} offset={-70}>
            <Button w="100%" colorScheme="blue">Reports</Button>
          </ScrollLink>
        </VStack>
      ) : (
        <Button
          bg={buttonBg}
          _hover={{ bg: buttonHoverBg }}
          w="100%"
          h="50px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <ChevronRightIcon boxSize={6} color="white" />
        </Button>
      )}
    </motion.div>
  );
};

export default Sidebar;
