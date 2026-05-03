'use client';

import { useEffect, useMemo, useState } from "react";
import { VStack, HStack, Text, Box, ProgressRoot, ProgressTrack, ProgressRange, Icon, Button } from "@chakra-ui/react";
import { course } from "@/consts/course";
import CourseCard from "@/components/ui/CourseCard";
import { getCourseProgress, markStepCompleted } from "@/lib/progress";

export default function Home() {
    const coursePlan = course;
    const totalSteps = coursePlan.steps.length;
    const [completedStepIds, setCompletedStepIds] = useState<string[]>([]);

    useEffect(() => {
        const stored = getCourseProgress();
        setCompletedStepIds(stored.completedStepIds);
    }, []);

    const completedSet = useMemo(() => new Set(completedStepIds), [completedStepIds]);
    const completedCount = completedStepIds.length;
    const progressPercentage = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;

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
                <div className="flex gap-6 flex-col items-center justify-center w-3/4">
                    {coursePlan.steps.map((step, index) => {
                        const isCompleted = completedSet.has(step.id);
                        const previousStepId = index > 0 ? coursePlan.steps[index - 1].id : null;
                        const isLocked = previousStepId ? !completedSet.has(previousStepId) : false;
                        const stepLink = step.link?.[0] ?? "#";

                        return (
                            <CourseCard
                                key={step.id}
                                title={step.title}
                                description={step.subtitle}
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