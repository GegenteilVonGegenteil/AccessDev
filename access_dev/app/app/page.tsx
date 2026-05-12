'use client';

import { useEffect, useMemo, useState } from "react";
import { VStack, HStack, Text, Box, ProgressRoot, ProgressTrack, ProgressRange} from "@chakra-ui/react";
import { course } from "@/consts/course";
import CourseCard from "@/components/ui/CourseCard";
import { getCourseProgress, markStepCompleted } from "@/lib/progress";

function getStepTitle(step: (typeof course.steps)[number]): string {
    return "name" in step ? step.name : step.title;
}

function getStepDescription(step: (typeof course.steps)[number]): string {
    return "description" in step && "name" in step ? step.description : step.subtitle;
}

export default function Home() {
    const coursePlan = course;
    const totalSteps = coursePlan.steps.length;
    const [completedStepIds, setCompletedStepIds] = useState<string[]>([]);
    const [isMounted, setIsMounted] = useState(false);
    const completedSet = useMemo(() => new Set(completedStepIds), [completedStepIds]);
    const completedCount = completedStepIds.length;
    const progressPercentage = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;

    useEffect(() => {
        setIsMounted(true);

        const stored = getCourseProgress();
        setCompletedStepIds(stored.completedStepIds);
    }, []);

    if (!isMounted) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Text fontSize="lg" color="var(--color-lavender-300)">
                    Loading course plan...
                </Text>
            </div>
        );
    }

    const handleStepAction = (stepId: string) => {
        const updated = markStepCompleted(stepId);
        setCompletedStepIds(updated.completedStepIds);
    };

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
                        const isCompleted = completedSet.has(step.id);
                        const previousStepId = index > 0 ? coursePlan.steps[index - 1].id : null;
                        const isLocked = previousStepId ? !completedSet.has(previousStepId) : false;
                        const stepLink = step.link?.[0] ?? "#";

                        return (
                            <CourseCard
                                key={step.id}
                                title={getStepTitle(step)}
                                description={getStepDescription(step)}
                                link={stepLink}
                                isLocked={isLocked}
                                isCompleted={isCompleted}
                                onAction={() => handleStepAction(step.id)}
                            />
                        );
                    })}
                </div>
            </div>
        </>
    )
}