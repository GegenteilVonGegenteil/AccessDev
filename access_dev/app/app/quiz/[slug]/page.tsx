import { getQuizBySlug } from "@/consts/quizzes";
import { notFound } from "next/navigation";
import { Box, Text} from "@chakra-ui/react";
import QuestionCard from "@/components/quiz/QuestionCard";

export default async function QuizPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;

    const quiz = getQuizBySlug(slug);

    if (!quiz) {
        notFound();
    }

    return (
        <Box display="flex" flexDirection="column" gap={8} alignItems="center">
            <Text w="full" fontSize="xl" fontWeight="bold">
                {quiz.name}
            </Text>
            <QuestionCard quiz={quiz} />
        </Box>
    )
};