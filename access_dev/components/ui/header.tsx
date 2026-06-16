import { Box, Text } from "@chakra-ui/react";

import { majorMonoDisplay } from "@/app/fonts";
import Link from "next/link";

// basic header with the logo leading to the dashboard
export default function Header() {
    return (
        <Box as="header" px="4" py="2" borderBottomWidth="1px" borderColor="var(--color-lavender-400)" display="flex">
            <Link href="/app" >
                <Text fontSize="2xl" className={`${majorMonoDisplay.className}`}>Access<span className="text-lavender-400">DEV</span></Text>
            </Link>
        </Box>
    )
}