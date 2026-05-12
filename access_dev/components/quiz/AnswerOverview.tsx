"use client";

import { Box, Tag, Text } from "@chakra-ui/react";
import { useState } from "react";
import { MdCheck, MdClose } from "react-icons/md";

export default function AnswerOverview({ id }: { id: number }) {
    const [isCorrect, setIsCorrect] = useState(true);

    let responseCorrectText = isCorrect ? "Correct!" : "False";
    let responseColor = isCorrect ? "var(--color-mantis-400)" : "var(--color-violet-eggplant-400)";
    let responseIcon = isCorrect ? <MdCheck size={24} color="var(--color-background)" /> : <MdClose size={24} color="var(--color-background)" />;


    return (
        <Box w="full" display="flex" alignItems="center" gap={4} bg="var(--color-lavender-950)" p={4} border="1px solid var(--color-lavender-500)" borderRadius="md">
            <Box bg={responseColor} p={2} borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                {responseIcon}
            </Box>
            <Box>
                <Box display="flex" alignItems="center" gap={4}>
                    <Text fontWeight="semibold">
                        Question {id}
                    </Text>
                    <Tag.Root size="sm" variant="subtle" bg={responseColor} color="var(--color-background)" borderRadius="sm">
                        <Tag.Label>
                            {responseCorrectText}
                        </Tag.Label>
                    </Tag.Root>
                </Box>
                <Text fontSize="sm">
                    Answer given by user goes gere
                </Text>
            </Box>
        </Box >
    )
}