import React, { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const CustomPieChart2 = () => {
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/user/getAllAngajati");
                setUsers(response.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const fetchTasks = async () => {
            if (users.length === 0) return;

            try {
                const tasksPromises = users.map(user =>
                    axios.get(`http://localhost:8080/api/task/getTasksByUser/${user.id}`)
                );

                const tasksResponses = await Promise.all(tasksPromises);
                setTasks(tasksResponses.map(res => res.data));
            } catch (err) {
                console.log(err);
            }
        };

        fetchTasks();
    }, [users]);

    const data = users.length === tasks.length ? users.map((user, index) => {
        return {
            name: user.nume,
            value: tasks[index].length
        };
    }) : [];
      
    const COLORS = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
        '#8B0000', '#FFD700', '#00FA9A', '#0000CD', '#ADFF2F', '#FFA07A',
        '#00CED1', '#FF4500', '#6A5ACD', '#FF6347', '#4682B4', '#DAA520',
        '#98FB98', '#FF00FF', '#40E0D0', '#FF1493', '#1E90FF', '#B22222',
        '#9ACD32', '#FFDAB9', '#20B2AA', '#87CEEB', '#FF69B4', '#8A2BE2',
        '#FFB6C1', '#6495ED', '#DC143C', '#00BFFF', '#7FFF00', '#F08080'
    ];
      

    return (
        <Box width="100%" height="400px">
            <Text fontSize="xl" mb={4} textAlign="center">Total Number of Tasks Each Employee Finished</Text>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default CustomPieChart2;
