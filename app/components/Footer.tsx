import { Box, Link, Text } from "@chakra-ui/react";
import React from "react";
import { HiHeart } from "react-icons/hi";

const Footer = () => {
  return (
    <Box as={"footer"} p={4} px={{ base: 4, sm: 6, md: 8, lg: 10 }} mt={5}>
      <Text
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap={2}
        fontSize={"sm"}
        borderTop={"1px solid"}
        py={4}
        borderColor={"gray.200"}
      >
        Created with <HiHeart color="red" style={{ display: "inline" }} />
        by
        <Link
          href="https://github.com/babatunde-ben"
          color={"blue.500"}
          target="_blank"
        >
          Babatunde Adeniyi
        </Link>
      </Text>
    </Box>
  );
};

export default Footer;
