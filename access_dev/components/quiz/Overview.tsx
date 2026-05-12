"use client";

import type { Quiz } from "@/consts/structures";
import { Box, Button, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import AnswerOverview from "./AnswerOverview";

export type QuizResult = {
    questionId: string;
    selectedOptionId: string | null;
    isCorrect: boolean;
};

type OverviewProps = {
    quiz: Quiz;
    results: QuizResult[];
    score: number;
    continueHref?: string;
};

export default function Overview({ quiz, results, score, continueHref }: OverviewProps) {
    return (
        <Box display="flex" flexDirection="column" gap={6} alignItems="center">
            <Text as="h2" fontSize="2xl" fontWeight="semibold">
                Your score: {score}/{quiz.questions.length}
            </Text>

            <Box w="1/2" maxW="200px" h="4px" bgGradient="to-r" gradientFrom="var(--color-violet-eggplant-900)" gradientTo="var(--color-mantis-400)" borderRadius="full" />

            <Box display="flex" flexDirection="column" gap={4} alignItems="center" w="full">
                {quiz.questions.map((question, index) => {
                    const result = results[index];

                    return (
                        <AnswerOverview
                            key={question.id}
                            question={question}
                            questionNumber={index + 1}
                            selectedOptionId={result?.selectedOptionId ?? null}
                            isCorrect={result?.isCorrect ?? false}
                        />
                    );
                })}
            </Box>

            {continueHref ? (
                <Box width="full" display="flex" justifyContent="end" gap={4}>
                    <NextLink href="/app" passHref>
                        <Button variant="outline" mr={4} color="var(--color-lavender-500)" borderColor="var(--color-lavender-500)" _hover={{ borderColor: "var(--color-lavender-400)", color: "var(--color-lavender-400)", bg: "transparent" }}>
                            Go Home
                        </Button>
                    </NextLink>
                    <NextLink href={continueHref} passHref>
                        <Button variant="solid" color="var(--color-background)" bg="var(--color-lavender-400)" _hover={{ bg: "var(--color-lavender-500)", textDecor: "none" }} >
                            Continue
                        </Button>
                    </NextLink>

                </Box>
            ) : (
                <Box width="full" display="flex" justifyContent="end" gap={4}>
                    <NextLink href="/app" passHref>
                        <Button variant="solid" color="var(--color-background)" bg="var(--color-lavender-400)" _hover={{ bg: "var(--color-lavender-500)", textDecor: "none" }} >
                            Go Home
                        </Button>
                    </NextLink>
                </Box>
            )
            }
        </Box>
    );
}