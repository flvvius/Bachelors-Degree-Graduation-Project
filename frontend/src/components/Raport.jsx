// components/Raport.js
import React, { useState } from 'react';
import { Box, Button, Flex, Select } from "@chakra-ui/react";
import axios from "axios";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Raport = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reportType, setReportType] = useState("month");

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
    }
  };

  return (
    <Box width="100%" height="400px">
      <Flex alignItems="center" justifyContent="center" mb={4}>
        <Select 
          value={reportType} 
          onChange={(e) => setReportType(e.target.value)} 
          mr={4}
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
          inline
        />
      </Flex>
      <Button onClick={handleDownload} colorScheme='blue'>Download PDF</Button>
    </Box>
  );
};

export default Raport;
