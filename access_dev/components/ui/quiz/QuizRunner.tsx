"use client";

import { useMemo, useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import type { Quiz } from "@/consts/structures";
import { course } from "@/consts/course";
import QuestionCard from "./QuestionCard";
import ResponseCard from "./ResponseCard";
import Overview, { type QuestionResult } from "./Overview";
import { markQuizCompleted, markStepCompleted } from "@/lib/progress";

// the quiz
type QuizRunnerProps = {
    quiz: Quiz;
};

// the component that handles the quiz functionality and flow
export default function QuizRunner({ quiz }: QuizRunnerProps) {
    // the index of the current question being displayed
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    // the option selected by the user
    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
    // if the user has submitted the answer
    const [submittedResponse, setSubmittedResponse] = useState(false);
    // the results of the quiz/its individual questions
    const [results, setResults] = useState<QuestionResult[]>([]);

    // determine if all questions have been answered
    const isFinished = currentQuestionIndex >= quiz.questions.length;
    // get the current question based on the index, or null if finished
    const currentQuestion = isFinished ? null : quiz.questions[currentQuestionIndex];
    // determine if question is the last one in the quiz
    const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

    // make a result object if the question was answered
    const currentResult = useMemo(() => {
        if (!currentQuestion || !submittedResponse || !selectedOptionId) {
            return null;
        }

        return {
            questionId: currentQuestion.id,
            selectedOptionId,
            // check if the selected option matches the correct option for the question
            isCorrect: selectedOptionId === currentQuestion.correctOptionId,
        } satisfies QuestionResult;
    }, [currentQuestion, selectedOptionId, submittedResponse]);

    // get the link for the next step of the course (as in the following challenge)
    const continueHref = useMemo(() => {
        const quizIndex = course.steps.findIndex((step) => step.id === quiz.id);

        return course.steps.slice(quizIndex + 1).find((step) => step.link?.[0])?.link?.[0];
    }, [quiz.id]);

    // handle submition of an answer
    const handleSubmit = () => {
        // make sure all necessary data exists
        if (!currentQuestion || !selectedOptionId || submittedResponse) {
            return;
        }

        // create a result object and add it to the results array
        const nextResult: QuestionResult = {
            questionId: currentQuestion.id,
            selectedOptionId,
            isCorrect: selectedOptionId === currentQuestion.correctOptionId,
        };

        setResults((currentResults) => [...currentResults, nextResult]);
        // mark it as submitted so the ResponseCard gets rendered
        setSubmittedResponse(true);
    };

    // handle moving onto the next step of the quiz
    const handleNext = () => {
        // ensure relevant data exists
        if (!submittedResponse || !currentQuestion) {
            return;
        }

        // if the current question is the last one, move on to the Overview, reset the selected option and submition state
        if (isLastQuestion) {
            setCurrentQuestionIndex(quiz.questions.length);
            setSelectedOptionId(null);
            setSubmittedResponse(false);
            return;
        }

        // otherwise, move onto the next question and reset the selected option and submition state
        setCurrentQuestionIndex((index) => index + 1);
        setSelectedOptionId(null);
        setSubmittedResponse(false);
    };

    // when the quiz is finished, save the progress to local storage and mark step as complete
    useEffect(() => {
        if (!isFinished) return;

        // get amount of correct answers
        const score = results.filter((result) => result.isCorrect).length;

        try {
            // mark the quiz as complete and save its score
            markQuizCompleted(quiz.id, score, quiz.questions.length);
            // mark the step as completed
            markStepCompleted(quiz.id);
        } catch {
            // currently no catch handling
        }
    }, [isFinished, results, quiz.id]);

    // if the quiz is finished, render the Overview with all results
    if (isFinished) {
        const score = results.filter((result) => result.isCorrect).length;

        return <Overview quiz={quiz} results={results} score={score} continueHref={continueHref} />;
    }

    // ensure current question exists
    if (!currentQuestion) {
        return null;
    }

    // if a response has been submitted, render the ResponseCard
    if (submittedResponse && currentResult) {
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

    // if the quiz isnt finished and no current response was submitted, render the QuestionCard
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