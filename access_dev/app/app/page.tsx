'use client';

import { useEffect, useMemo, useState } from "react";
import { VStack, HStack, Text, Box, ProgressRoot, ProgressTrack, ProgressRange} from "@chakra-ui/react";
import { course } from "@/consts/course";
import CourseCard from "@/components/ui/CourseCard";
import { getCourseProgress, getChallengesProgress, getQuizzesProgress } from "@/lib/progress";

// dashboard showing all steps, including which ones are completed and which one is to be done next, as well as performance metrics
export default function Home() {
    // the entire course with all steps
    const coursePlan = course;
    // how many steps are in the course
    const totalSteps = coursePlan.steps.length;
    // how many steps have been completed so far
    const [completedStepIds, setCompletedStepIds] = useState<string[]>([]);
    // the progress/performance metrics of the user for the challenges
    const [challengesProgress, setChallengesProgress] = useState<any>(null);
    // the progress/performance metrics of the user for the quizzes
    const [quizzesProgress, setQuizzesProgress] = useState<any>(null);
    // whether the component has been mounted (to avoid hydration issues)
    const [isMounted, setIsMounted] = useState(false);
    // all completed steps
    const completedSet = useMemo(() => new Set(completedStepIds), [completedStepIds]);
    // how many steps have been completed so far
    const completedCount = completedStepIds.length;
    // the percentage of steps completed so far
    const progressPercentage = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;

    // once the component is mounted, 
    useEffect(() => {
        setIsMounted(true);

        const stored = getCourseProgress();
        setCompletedStepIds(stored.completedStepIds);

        const challengeProgress = getChallengesProgress();
        setChallengesProgress(challengeProgress.completed);

        const quizzesProgress = getQuizzesProgress();
        setQuizzesProgress(quizzesProgress.completed);
    }, []);

    // if the component is not mounted yet, show a loading state
    if (!isMounted) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Text fontSize="lg" color="var(--color-lavender-300)">
                    Loading course plan...
                </Text>
            </div>
        );
    }

    // the content of the page
    return (
        <>
            <div className="flex flex-1 flex-col items-end justify-center">
                <VStack gap={4} align="stretch" w="50%" p={6} marginBottom={6}>
                    <HStack justify="end">
                        <Text fontSize="lg" fontWeight="bold">Progress: {completedCount}/{totalSteps} ({Math.round(progressPercentage)}%)</Text>
                    </HStack>
                    <Box>
                        <ProgressRoot value={progressPercentage}>
                            <ProgressTrack>
                                <ProgressRange bg="var(--color-lavender-500)" />
                            </ProgressTrack>
                        </ProgressRoot>
                    </Box>
                </VStack>
            </div>
            <div className="flex flex-col items-center justify-start">
                <Text as="h1" fontSize="3xl" fontWeight="bold" mb={8} w="3/4"> Course Plan </Text>
                <div className="flex gap-6 flex-col items-center justify-center w-3/4">
                    {coursePlan.steps.map((step, index) => {
                        {/* relevant step data */}
                        const stepIdStr = String(step.id);
                        const isCompleted = completedSet.has(stepIdStr);
                        const previousStepId = index > 0 ? String(coursePlan.steps[index - 1].id) : null;
                        const isLocked = previousStepId ? !completedSet.has(previousStepId) : false;
                        const stepLink = step.link?.[0] ?? "#";

                        {/* meta for the steps, given to the  */}
                        let meta: string | undefined;

                        {/* for quizes, display how many questions were answered correctly */}
                        if ("type" in step && step.type === "quiz") {
                            const q = quizzesProgress?.[step.id];
                            if (q) {
                                const correct = Number(q.correctCount) ?? 0;
                                const total = Number(q.totalCount) ?? 0;
                                const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
                                meta = `${correct}/${total} (${pct}%)`;
                            }
                        } else {
                            {/* for challenges, display how many issues were resolved */}
                            if ("type" in step && step.type === "keyboard-navigation" || step.type === "screen-reader" || step.type === "contrast") {
                                const slug = step.slug;
                                if (slug) {
                                    const challengeProgress = challengesProgress?.[slug];
                                    if (challengeProgress) {
                                        const resolved = Math.min(Number(challengeProgress.resolvedCount) ?? 0, Number(challengeProgress.totalCount) ?? 0);
                                        const total = Number(challengeProgress.totalCount) ?? 0;
                                        const pct = total > 0 ? Math.round((resolved / total) * 100) : 0;
                                        meta = `${resolved}/${total} (${pct}%)`;
                                    }
                                }
                            }
                        }

                        {/* Course Card component rendering the steps information */}
                        return (
                            <CourseCard
                                key={stepIdStr}
                                title={step.title}
                                description={step.subtitle}
                                link={stepLink}
                                isLocked={isLocked}
                                isCompleted={isCompleted}
                                onAction={() => {}}
                                meta={meta}
                            />
                        );
                    })}
                </div>
            </div>
        </>
    )
}