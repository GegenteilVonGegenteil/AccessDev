import { getQuizBySlug } from "@/consts/quizzes";
import { notFound } from "next/navigation";
import { Box, Text } from "@chakra-ui/react";
import QuizRunner from "@/components/ui/quiz/QuizRunner";

export default async function QuizPage({ params }: { params: { slug: string } }) {
    // get the quiz via slug
    const { slug } = await params;
    const quiz = getQuizBySlug(slug);

    // render 404 if no quiz found
    if (!quiz) {
        notFound();
    }

    // return the quiz runner component with the quiz data
    return (
        <Box display="flex" flexDirection="column" gap={8} alignItems="center">
            <Text as="h1" w="full" fontSize="xl" fontWeight="bold">
                Quiz: {quiz.title}
            </Text>
            <QuizRunner quiz={quiz} />
        </Box >
    )
};