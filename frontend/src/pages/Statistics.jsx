import { Box, Flex } from "@chakra-ui/react";
import CustomPieChart from "../components/CustomPieChart";
import CustomPieChart2 from "../components/CustomPieChart2";
import CustomBarChart from "../components/CustomBarChart";
import CustomBarChart2 from "../components/CustomBarChart2"

const Statistics = () => {
    return (
        <Box p={5}>
            <Flex p={5} alignItems="center" justifyContent="center">
                <CustomPieChart />
                <CustomPieChart2 />
            </Flex>
            <Flex p={20}>
                <CustomBarChart />
            </Flex>
            <Flex p={20}>
                <CustomBarChart2 />
            </Flex>
        </Box>
        
    )
}

export default Statistics;