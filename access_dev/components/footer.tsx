import { Box, Text } from "@chakra-ui/react";

import Link from "next/link";

export default function Footer() {
    return (
        <Box as="footer" py={4} borderTopWidth="1px" borderColor="var(--color-lavender-400)" display="flex" justifyContent="center" alignItems="center">
            <Text fontSize="sm" color="var(--color-lavender-300)">Bachelor Thesis Project by <Link href="https://github.com/accessdev" target="_blank" rel="noopener noreferrer">AccessDEV</Link></Text>
        </Box>
    )
}