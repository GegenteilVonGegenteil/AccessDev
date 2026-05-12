"use client";

import { useMemo, useState, useEffect } from "react";
import { Box, Text } from "@chakra-ui/react";
import type { Quiz } from "@/consts/structures";
import { course } from "@/consts/course";
import QuestionCard from "./QuestionCard";
import ResponseCard from "./ResponseCard";
import Overview, { type QuizResult } from "./Overview";
import { markQuizCompleted, markStepCompleted } from "@/lib/progress";

type QuizRunnerProps = {
    quiz: Quiz;
};

export default function QuizRunner({ quiz }: QuizRunnerProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
    const [showResponse, setShowResponse] = useState(false);
    const [results, setResults] = useState<QuizResult[]>([]);

    const isFinished = currentQuestionIndex >= quiz.questions.length;
    const currentQuestion = isFinished ? null : quiz.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

    const currentResult = useMemo(() => {
        if (!currentQuestion || !showResponse || !selectedOptionId) {
            return null;
        }

        return {
            questionId: currentQuestion.id,
            selectedOptionId,
            isCorrect: selectedOptionId === currentQuestion.correctOptionId,
        } satisfies QuizResult;
    }, [currentQuestion, selectedOptionId, showResponse]);

    const continueHref = useMemo(() => {
        const quizIndex = course.steps.findIndex((step) => step.id === quiz.id);

        if (quizIndex < 0) {
            return undefined;
        }

        return course.steps.slice(quizIndex + 1).find((step) => step.link?.[0])?.link?.[0];
    }, [quiz.id]);

    const handleSubmit = () => {
        if (!currentQuestion || !selectedOptionId || showResponse) {
            return;
        }

        const nextResult: QuizResult = {
            questionId: currentQuestion.id,
            selectedOptionId,
            isCorrect: selectedOptionId === currentQuestion.correctOptionId,
        };

        setResults((currentResults) => [...currentResults, nextResult]);
        setShowResponse(true);
    };

    const handleNext = () => {
        if (!showResponse || !currentQuestion) {
            return;
        }

        if (isLastQuestion) {
            setCurrentQuestionIndex(quiz.questions.length);
            setSelectedOptionId(null);
            setShowResponse(false);
            return;
        }

        setCurrentQuestionIndex((index) => index + 1);
        setSelectedOptionId(null);
        setShowResponse(false);
    };

    const [hasSavedResults, setHasSavedResults] = useState(false);

    useEffect(() => {
        if (!isFinished) return;

        // avoid saving multiple times
        if (hasSavedResults) return;

        const score = results.filter((result) => result.isCorrect).length;

        try {
            markQuizCompleted(quiz.id, score, quiz.questions.length);
            markStepCompleted(quiz.id);
        } catch {
            // ignore storage errors
        }

        setHasSavedResults(true);
    }, [isFinished, results, quiz, hasSavedResults]);

    if (isFinished) {
        const score = results.filter((result) => result.isCorrect).length;

        return <Overview quiz={quiz} results={results} score={score} continueHref={continueHref} />;
    }

    if (!currentQuestion) {
        return null;
    }

    if (showResponse && currentResult) {
        return (
            <ResponseCard
                question={currentQuestion}
                selectedOptionId={selectedOptionId}
                isCorrect={currentResult.isCorrect}
                isLastQuestion={isLastQuestion}
                onNext={handleNext}
            />
        );
    }

    return (
        <Box display="flex" flexDirection="column" gap={8} alignItems="center" w="full">
            <QuestionCard
                question={currentQuestion}
                selectedOptionId={selectedOptionId}
                onSelectOption={setSelectedOptionId}
                onSubmit={handleSubmit}
                isSubmitDisabled={!selectedOptionId}
            />
        </Box>
    );
}