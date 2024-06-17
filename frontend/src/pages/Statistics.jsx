import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import CustomPieChart from "../components/CustomPieChart";
import CustomPieChart2 from "../components/CustomPieChart2";
import CustomBarChart from "../components/CustomBarChart";
import CustomBarChart2 from "../components/CustomBarChart2"
import CalculPontaj from "../components/CalculPontaj";
import SatisfactieAngajati from "../components/SatisfactieAngajati";

const Statistics = () => {

    const bg = useColorModeValue("gray.200", "gray.700");

    return (
        <Box p={5}>
            <Box bg={bg} marginBottom={10}>
                <CalculPontaj />
            </Box>
            <Box bg={bg} marginTop={10} marginBottom={10}>
                <SatisfactieAngajati />
            </Box>
            <Flex p={5} alignItems="center" justifyContent="center" bg={bg}>
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