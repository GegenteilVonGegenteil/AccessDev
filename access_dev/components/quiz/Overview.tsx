"use client"

import { Quiz } from "@/consts/structures";
import { Box, Text, Button } from "@chakra-ui/react";
import AnswerOverview from "./AnswerOverview";
import NextLink from "next/link";

export default function Overview(quiz: { quiz: Quiz }) {

    return (
        <Box display="flex" flexDirection="column" gap={6} alignItems="center">
            <Text as="h2" fontSize="2xl" fontWeight="semibold">
                Your score: 0/{quiz.quiz.questions.length}
            </Text>

            <Box w="1/2" maxW="200px" h="4px" bgGradient="to-r" gradientFrom="var(--color-violet-eggplant-900)" gradientTo="var(--color-mantis-400)" borderRadius="full" />

            <Box display="flex" flexDirection="column" gap={4} alignItems="center">
                {quiz.quiz.questions.map((question, index) => (
                    <AnswerOverview key={question.id} id={index + 1} />
                ))}
            </Box>
            <Box width="3xl" display="flex" justifyContent="end" gap={4}>
                <NextLink href="/app">
                    <Button variant="outline" color="var(--color-lavender-500)" borderColor="var(--color-lavender-500)" _hover={{ borderColor: "var(--color-lavender-400)", color: "var(--color-lavender-400)", bg: "transparent" }}>
                        Go Home
                    </Button>
                </NextLink>


                <NextLink href={`/app/challenges/${parseInt(quiz.quiz.id)}/preview`}>
                    <Button variant="solid" color="var(--color-background)" bg="var(--color-lavender-400)" _hover={{ bg: "var(--color-lavender-500)", textDecor: "none" }}>
                        Continue
                    </Button>
                </NextLink>
            </Box>
        </Box>
    )
}