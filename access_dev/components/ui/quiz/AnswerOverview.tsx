"use client";

import type { Question } from "@/consts/structures";
import { Box, Tag, Text } from "@chakra-ui/react";
import { MdCheck, MdClose } from "react-icons/md";

// properites relating to a single question and the answer given
type AnswerOverviewProps = {
    question: Question;
    questionNumber: number;
    selectedOptionId: string | null;
    isCorrect: boolean;
};

// component displaying the imediate feedback after a question
export default function AnswerOverview({ question, questionNumber, selectedOptionId, isCorrect }: AnswerOverviewProps) {
    // the option selected by the user
    const selectedOption = question.options.find((option) => option.id === selectedOptionId);

    // text, color and icon depending on whether the answer was correct or not
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
                        Question {questionNumber}
                    </Text>
                    <Tag.Root size="sm" variant="subtle" bg={responseColor} color="var(--color-background)" borderRadius="sm">
                        <Tag.Label>
                            {responseCorrectText}
                        </Tag.Label>
                    </Tag.Root>
                </Box>
                <Text fontSize="sm">
                    Your answer: {selectedOption?.text ?? "No answer selected"}
                </Text>
            </Box>
        </Box >
    )
}