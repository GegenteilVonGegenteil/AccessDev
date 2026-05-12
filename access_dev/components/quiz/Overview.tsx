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

            <Box width="3xl" display="flex" justifyContent="end" gap={4}>
                <NextLink href="/app" passHref>
                    <Button variant="outline" color="var(--color-lavender-500)" borderColor="var(--color-lavender-500)" _hover={{ borderColor: "var(--color-lavender-300)", color: "var(--color-lavender-300)", bgColor: "transparent" }}>
                        Go Home
                    </Button>
                </NextLink>
                {continueHref ? (
                    <NextLink href={continueHref} passHref>
                        <Button variant="solid" color="var(--color-background)" bgColor="var(--color-lavender-500)" _hover={{ bgColor: "var(--color-lavender-400)" }}>
                            Continue
                        </Button>
                    </NextLink>
                ) : null}
            </Box>
        </Box>
    );
}