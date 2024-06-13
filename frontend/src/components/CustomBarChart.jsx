import React, { useEffect, useState } from 'react';
import { Box, Text, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import Select from 'react-select';
import axios from 'axios';

const COLORS = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
  '#8B0000', '#FFD700', '#00FA9A', '#0000CD', '#ADFF2F', '#FFA07A',
  '#00CED1', '#FF4500', '#6A5ACD', '#FF6347', '#4682B4', '#DAA520',
  '#98FB98', '#FF00FF', '#40E0D0', '#FF1493', '#1E90FF', '#B22222',
  '#9ACD32', '#FFDAB9', '#20B2AA', '#87CEEB', '#FF69B4', '#8A2BE2',
  '#FFB6C1', '#6495ED', '#DC143C', '#00BFFF', '#7FFF00', '#F08080'
];

const CustomBarChart = () => {
    const { colorMode } = useColorMode();
    const bgColor = useColorModeValue("gray.100", "gray.700");
    const textColor = useColorModeValue("black", "white");
    const gridColor = useColorModeValue("#ccc", "#555");
    const tooltipBgColor = useColorModeValue("#fff", "#2D3748");
    const tooltipTextColor = useColorModeValue("black", "white");

    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [tasksData, setTasksData] = useState([]);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/user/getAllAngajati");
                const userOptions = response.data.map(user => ({ value: user.id, label: user.nume }));
                setUsers(userOptions);
                setSelectedUsers(userOptions); // Initially select all users
            } catch (err) {
                console.log(err);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const fetchTasks = async () => {
            if (selectedUsers.length === 0) {
                setData([]);
                return;
            }

            try {
                const tasksPromises = selectedUsers.map(user =>
                    axios.get(`http://localhost:8080/api/task/getFinishedTasksByUser/${user.value}`)
                );

                const tasksResponses = await Promise.all(tasksPromises);
                const tasksData = tasksResponses.map((res, index) => ({
                    userId: selectedUsers[index].value,
                    tasks: res.data
                }));
                setTasksData(tasksData);
            } catch (err) {
                console.log(err);
            }
        };

        fetchTasks();
    }, [selectedUsers]);

    useEffect(() => {
        const aggregatedData = aggregateTasksByMonth(tasksData, selectedUsers);
        setData(aggregatedData);
    }, [tasksData, selectedUsers]);

    const aggregateTasksByMonth = (tasksData, selectedUsers) => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const aggregatedData = months.map((month, index) => {
            const monthData = { month };
            selectedUsers.forEach(user => {
                const userTasks = tasksData.find(data => data.userId === user.value)?.tasks || [];
                const tasksInMonth = userTasks.filter(task => new Date(task.data_finalizare).getMonth() === index).length;
                monthData[user.label] = tasksInMonth;
            });
            return monthData;
        });

        return aggregatedData;
    };

    const handleUserSelectionChange = (selectedOptions) => {
        setSelectedUsers(selectedOptions || []);
    };

    return (
        <Box width="100%" p={5} bg={bgColor} borderRadius="lg" boxShadow="lg">
            <Text fontSize="2xl" mb={4} textAlign="center" fontWeight="bold" color={textColor}>Number of Tasks Each Employee Finished Before Deadline by Month</Text>
            <Box mb={5}>
                <Text mb={2} color={textColor}>Select Employees:</Text>
                <Select
                    isMulti
                    options={users}
                    value={selectedUsers}
                    onChange={handleUserSelectionChange}
                    styles={{
                        control: (provided) => ({
                            ...provided,
                            backgroundColor: bgColor,
                            color: textColor
                        }),
                        singleValue: (provided) => ({
                            ...provided,
                            color: textColor
                        }),
                        multiValue: (provided) => ({
                            ...provided,
                            backgroundColor: bgColor
                        }),
                        multiValueLabel: (provided) => ({
                            ...provided,
                            color: textColor
                        }),
                        menu: (provided) => ({
                            ...provided,
                            backgroundColor: bgColor
                        })
                    }}
                />
            </Box>
            <Box height="500px">
                <ResponsiveContainer>
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis dataKey="month" tick={{ fontSize: 14, fontWeight: 'bold', fill: textColor }} />
                        <YAxis tick={{ fontSize: 14, fontWeight: 'bold', fill: textColor }} />
                        <Tooltip contentStyle={{ backgroundColor: tooltipBgColor, border: '1px solid #ccc', color: tooltipTextColor }} />
                        <Legend verticalAlign="top" height={36} wrapperStyle={{ color: textColor }} />
                        {selectedUsers.map((user, index) => (
                            <Bar key={user.value} dataKey={user.label} fill={COLORS[index % COLORS.length]} barSize={20} />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    );
};

export default CustomBarChart;
