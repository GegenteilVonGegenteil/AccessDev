"use client";

import { Quiz } from "@/consts/structures";
import { Box, Text, Button, Link } from "@chakra-ui/react";
import { useState } from "react";
import { MdCheck, MdClose } from "react-icons/md";

export default function ResponseCard({ quiz }: { quiz: Quiz }) {
    const [isCorrect, setIsCorrect] = useState(false);

    let responseCorrectText = isCorrect ? "Correct!" : "False";
    let responseColor = isCorrect ? "var(--color-mantis-400)" : "var(--color-violet-eggplant-400)";
    let responseIcon = isCorrect ? <MdCheck size={24} color="var(--color-background)" /> : <MdClose size={24} color="var(--color-background)" />;

    return (
        <Box w="3xl" borderWidth="1px" borderRadius="lg" borderColor="var(--color-lavender-500)" p={8} display="flex" flexDirection="column" gap={6} alignItems="center">
            <Box w="full" display="flex" gap={2} alignItems="center" justifyContent="center">
                <Box bg={responseColor} p={2} borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                    {responseIcon}
                </Box>
                <Text fontSize="3xl" fontWeight="bold" color={responseColor}>
                    {responseCorrectText}
                </Text>
            </Box>
            <Box w="full" display="flex" gap={2} flexDirection="column">
                <Text fontWeight="semibold" fontSize="md">
                    Your Answer:
                </Text>
                <Text fontSize="md">
                    {quiz.questions[0].options.find((option) => option.id === quiz.questions[0].correctOptionId)?.text}
                </Text>
            </Box>
            {
                !isCorrect && (
                    <Box w="full" display="flex" gap={2} flexDirection="column">
                        <Text fontWeight="semibold" fontSize="md" color="var(--color-mantis-400)">
                            Correct Answer:
                        </Text>
                        <Text fontSize="md" color="var(--color-mantis-100)">
                            {quiz.questions[0].options.find((option) => option.id === quiz.questions[0].correctOptionId)?.text}
                        </Text>
                    </Box>
                )
            }
            <Box w="full" display="flex" gap={2} flexDirection="column">
                <Text w="full">
                    {quiz.questions[0].explanation}
                </Text>
                <Text w="full" display="flex" gap={2} alignItems="center">
                    Learn more
                    <Link href={quiz.questions[0].link[0]} target="_blank"
                        rel="noopener noreferrer"
                        color="var(--color-violet-eggplant-400)"
                        variant="underline"
                        _hover={{ color: "var(--color-violet-eggplant-600)" }}>
                        here
                    </Link>
                </Text>
            </Box>
            <div className="flex w-full justify-end">
                <Button size="md" variant="solid" color="var(--color-background)" bg="var(--color-lavender-400)" _hover={{ bg: "var(--color-lavender-500)", textDecor: "none" }}>
                    Next
                </Button>
            </div>
        </Box>
    )
}