import { Box, Heading, HStack } from "@chakra-ui/react";
import React from "react";
import { LuKanban } from "react-icons/lu";

const Navbar = () => {
  return (
    <Box as={"nav"} p={4} px={{ base: 4, sm: 6, md: 8, lg: 10 }}>
      <HStack
        align="center"
        gap={3}
        pb={4}
        borderBottom={"1px solid"}
        borderColor={"gray.200"}
      >
        <LuKanban />

        <Heading>DoneTrail</Heading>
      </HStack>
    </Box>
  );
};

export default Navbar;
