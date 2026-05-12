"use client";

import type { Question } from "@/consts/structures";
import { Box, Text, Button, Link } from "@chakra-ui/react";
import { MdCheck, MdClose } from "react-icons/md";

type ResponseCardProps = {
    question: Question;
    selectedOptionId: string | null;
    isCorrect: boolean;
    onNext: () => void;
    isLastQuestion?: boolean;
};

export default function ResponseCard({ question, selectedOptionId, isCorrect, onNext, isLastQuestion = false }: ResponseCardProps) {
    const selectedOption = question.options.find((option) => option.id === selectedOptionId);
    const correctOption = question.options.find((option) => option.id === question.correctOptionId);

    const responseCorrectText = isCorrect ? "Correct!" : "Incorrect";
    const responseColor = isCorrect ? "var(--color-mantis-400)" : "var(--color-violet-eggplant-400)";
    const responseIcon = isCorrect ? <MdCheck size={24} color="var(--color-background)" /> : <MdClose size={24} color="var(--color-background)" />;

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
                    {selectedOption?.text ?? "No answer selected"}
                </Text>
            </Box>
            {
                !isCorrect && (
                    <Box w="full" display="flex" gap={2} flexDirection="column">
                        <Text fontWeight="semibold" fontSize="md" color="var(--color-mantis-400)">
                            Correct Answer:
                        </Text>
                        <Text fontSize="md" color="var(--color-mantis-100)">
                            {correctOption?.text ?? "Unknown answer"}
                        </Text>
                    </Box>
                )
            }
            <Box w="full" display="flex" gap={2} flexDirection="column">
                <Text w="full">
                    {question.explanation}
                </Text>
                <Text w="full" display="flex" gap={2} alignItems="center">
                    Learn more
                    {question.link?.[0] ? (
                        <Link
                            href={question.link[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            color="var(--color-violet-eggplant-400)"
                            variant="underline"
                            _hover={{ color: "var(--color-violet-eggplant-600)" }}
                        >
                            here
                        </Link>
                    ) : null}
                </Text>
            </Box>
            <div className="flex w-full justify-end">
                <Button size="md" variant="solid" color="var(--color-background)" bg="var(--color-lavender-400)" onClick={onNext} _hover={{ bg: "var(--color-lavender-500)", textDecor: "none" }}>
                    {isLastQuestion ? "Finish" : "Next"}
                </Button>
            </div>
        </Box>
    );
}