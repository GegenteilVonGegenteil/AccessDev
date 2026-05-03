import { Box, Text } from "@chakra-ui/react";

import Link from "next/link";

export default function Footer() {
    return (
        <Box as="footer" py={4} borderTopWidth="1px" borderColor="var(--color-lavender-400)" display="flex" justifyContent="center" alignItems="center">
            <Text fontSize="sm" color="var(--color-lavender-300)">Bachelor Thesis Project <Link href="https://github.com/GegenteilVonGegenteil/AccessDev" target="_blank" rel="noopener noreferrer">Repo</Link></Text>
        </Box>
    )
}