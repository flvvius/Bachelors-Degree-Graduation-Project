import React, { useState } from 'react';
import { Box, Button, Flex, Select, useToast, Heading, VStack, HStack, useColorModeValue } from "@chakra-ui/react";
import axios from "axios";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Raport = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reportType, setReportType] = useState("month");
  const toast = useToast();
  const bg = useColorModeValue('gray.100', 'gray.700');
  const color = useColorModeValue('black', 'white');
  const buttonBg = useColorModeValue('blue.500', 'blue.300');
  const buttonHoverBg = useColorModeValue('blue.600', 'blue.400');
  const buttonTextColor = useColorModeValue('white', 'black');

  const handleDownload = async () => {
    try {
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return reportType === "year" ? `${year}` : `${year}-${month}`;
      };

      const formattedDate = formatDate(selectedDate);

      const response = await axios.get(`http://localhost:8080/api/user/raport?date=${formattedDate}&type=${reportType}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'raport.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading PDF:', error);
      if (error.response && error.response.status === 404) {
        toast({
          title: "No data found",
          description: "No data found for the specified date range.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: 'top-right'
        });
      } else {
        toast({
          title: "Error",
          description: "An error occurred while downloading the report.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: 'top-right'
        });
      }
    }
  };

  return (
    <Box width="100%" height="fit-content" p={8} bg={bg} color={color}>
      <VStack spacing={8} align="center">
        <Heading as="h1" size="xl" mb={8}>
          Generate Report
        </Heading>
        <HStack spacing={4} align="center">
          <Select 
            value={reportType} 
            onChange={(e) => setReportType(e.target.value)} 
            width="150px"
          >
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
          </Select>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            showMonthYearPicker={reportType === "month"}
            showYearPicker={reportType === "year"}
            dateFormat={reportType === "year" ? "yyyy" : "MM/yyyy"}
            customInput={<Button variant="outline" bg={buttonBg} color={buttonTextColor} _hover={{ bg: buttonHoverBg }}>{reportType === "year" ? selectedDate.getFullYear() : `${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`}</Button>}
          />
        </HStack>
        <Button onClick={handleDownload} bg={buttonBg} color={buttonTextColor} _hover={{ bg: buttonHoverBg }} size='lg'>
          Download PDF
        </Button>
      </VStack>
    </Box>
  );
};

export default Raport;
