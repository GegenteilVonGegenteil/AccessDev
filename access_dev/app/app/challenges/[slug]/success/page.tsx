"use client";

import { useEffect, useMemo, useState } from "react";
import NextLink from "next/link";
import { useParams, notFound } from "next/navigation";
import { Box, Button, Link, Text } from "@chakra-ui/react";
import { getChallengeBySlug } from "@/consts/challenges";
import { course } from "@/consts/course";
import {
    getChallengesProgress,
    markStepCompleted,
    type ChallengeCompletion,
} from "@/lib/progress";

// page shown after a challenge was completed, giving an overview of success and additional resources
export default function ChallengeSuccessPage() {

    //get the challenge slug from the url
    const params = useParams<{ slug: string }>();
    const slug = typeof params?.slug === "string" ? params.slug : "";
    const challenge = useMemo(() => getChallengeBySlug(slug), [slug]);
    const [completion, setCompletion] = useState<ChallengeCompletion | null>(null);

    // return a 404 page if the challenge is not found
     if (!challenge) {
        return notFound();
    }

    // get the completion data for the challenge to be displayed
    useEffect(() => {
        if (!slug) {
            return;
        }

        const progress = getChallengesProgress();
        setCompletion(progress.completed[slug] ?? null);
    }, [slug]);

    // set the current step as completed when the page is loaded
    useEffect(() => {
        if (!challenge) {
            return;
        }

        // get the current step based on the slug
        const currentPath = `/app/challenges/${challenge.slug}/preview`;
        // find the step in the course that matches the current path
        const completedStep = course.steps.find((step) => step.link?.[0] === currentPath);

        // if the step exists, mark it as completed
        if (completedStep) {
            markStepCompleted(String(completedStep.id));
        }
    }, [challenge]);

    // get the next step (quiz) after for the continue button
    const nextStep = useMemo(() => {
        if (!challenge) {
            return null;
        }

        // get the index of the current step in the course
        const currentPath = `/app/challenges/${challenge.slug}/preview`;
        const currentIndex = course.steps.findIndex((step) => step.link?.[0] === currentPath);

        // find the next step in the course based on index
        return course.steps.slice(currentIndex + 1).find((step) => Boolean(step.link?.[0])) ?? null;
    }, [challenge]);

    // relevant data concerning the errors and hints in the challenge and the users performance
    const totalIssues = challenge.errors.length;
    const resolvedIssues = Math.min(completion?.resolvedCount ?? 0, totalIssues);
    const totalHints = challenge.hints.length;
    const hintsUsed = completion?.hintsUsed ?? 0;

    // link to the next step
    const nextHref = nextStep?.link?.[0];

    // the rendered completion page
    return (
        <div className="flex flex-col items-center justify-center gap-6 py-12 h-full w-full">
            <Text as="h1" fontSize="2xl" fontWeight="bold">
                Challenge {challenge.id}: {challenge.title}
            </Text>

            {/* conditional rendering dependent on the amount of errors fixed */}
            <Text fontSize="md" maxW="3xl" textAlign="center">
                {resolvedIssues === totalIssues
                    ? "Great work! You fixed the accessibility issues and completed the challenge. Feel free to continue, redo this challenge or revisit the previous quiz to see how you fare!"
                    : resolvedIssues > 0
                      ? "You completed the challenge but missed some accessibility issues. Consider revisiting the challenge to see what you missed and try again!"
                      : "You completed the challenge but didn't resolve any accessibility issues. Consider revisiting the challenge to see what you missed and try again!"}
            </Text>

            <Box borderWidth="1px" borderRadius="sm" borderColor="var(--color-lavender-500)" p={6} width="3xl" display="flex" flexDirection="column" gap={4}>
                <Box w="full" display="flex" alignItems="center" justifyContent="space-between" borderBottomWidth="1px" borderColor="var(--color-lavender-500)" pb={4}>
                    <Text fontSize="md">Issues Fixed</Text>
                    <Text fontSize="md">{resolvedIssues}/{totalIssues}</Text>
                </Box>
                <Box w="full" display="flex" alignItems="center" justifyContent="space-between" borderBottomWidth="1px" borderColor="var(--color-lavender-500)" pb={4}>
                    <Text fontSize="md">Hints Used</Text>
                    <Text fontSize="md">{hintsUsed}/{totalHints}</Text>
                </Box>
            </Box>

            <Box borderWidth="1px" borderRadius="sm" borderColor="var(--color-lavender-500)" padding={6} width="3xl" display="flex" flexDirection="column" alignItems="center" gap={4}  >
                <Box w="full" display="flex" alignItems="center" borderBottomWidth="1px" borderColor="var(--color-lavender-500)" paddingBottom={4}>
                    <Text fontSize="md">What you learned</Text>
                </Box>
                <Box w="full" display="flex" flexDirection="column" gap={2}>
                    {challenge.errors.map((error) => (
                        <Text key={error} fontSize="sm">{error}</Text>
                    ))}
                </Box>
            </Box>

            <Box borderWidth="1px" borderRadius="sm" borderColor="var(--color-lavender-500)" p={6} width="3xl" display="flex" flexDirection="column" gap={4}>
                <Box w="full" display="flex" alignItems="center" borderBottomWidth="1px" borderColor="var(--color-lavender-500)" pb={4}>
                    <Text fontSize="md">Further Reading</Text>
                </Box>
                <Box w="full" display="flex" flexDirection="column" gap={2}>
                    {challenge.resources.map((resource) => (
                        <Link
                            key={resource.href}
                            href={resource.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            color="var(--color-violet-eggplant-400)"
                            variant="underline"
                        >
                            {resource.label}
                        </Link>
                    ))}
                </Box>
            </Box>

            <Box width="3xl" display="flex" justifyContent="end" gap={4}>
                <NextLink href="/app">
                    <Button variant="outline" mr={4} color="var(--color-lavender-500)" borderColor="var(--color-lavender-500)" _hover={{ borderColor: "var(--color-lavender-400)", color: "var(--color-lavender-400)", bg: "transparent" }} >
                        Go Home
                    </Button>
                </NextLink>

                {nextHref ? (
                    <NextLink href={nextHref}>
                        <Button variant="solid" color="var(--color-background)" bg="var(--color-lavender-400)" _hover={{ bg: "var(--color-lavender-500)", textDecor: "none" }} >
                            Continue
                        </Button>
                    </NextLink>
                ) : null}
            </Box>
        </div>
    );
}