import { Text, Box, Link, Button } from "@chakra-ui/react";
import { notFound } from "next/navigation";
import { getChallengeBySlug } from "@/consts/challenges";

export default async function ChallengeSuccessPage({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
    const { slug } = await params;
    const challenge = getChallengeBySlug(slug);

    if (!challenge) {
        notFound();
    }

    return (
        <div className="flex flex-col items-center justify-center gap-6 py-12 h-full w-full">
            <Text as="h1" fontSize="2xl" fontWeight="bold">
                Challenge Completed!
            </Text>
            <Text fontSize="md" width="1/2" textAlign="center">
                Great work! You fixed the accessibility issues and completed the challenge. Feel free to continue, redo this challenge or revisit the previous quiz to see how you fare!
            </Text>

            <Box borderWidth="1px" borderRadius="sm" borderColor="var(--color-lavender-500)" padding={6} width="3xl" display="flex" flexDirection="column" alignItems="center" gap={4}  >
                <Box w="full" display="flex" alignItems="center" justifyContent="space-between" borderBottomWidth="1px" borderColor="var(--color-lavender-500)" paddingBottom={4}>
                    <Text fontSize="md">Issues Fixed</Text>
                    <Text fontSize="md">3/3</Text>
                </Box>
                <Box w="full" display="flex" alignItems="center" justifyContent="space-between">
                    <Text fontSize="md">Hints Used</Text>
                    <Text fontSize="md">3/3</Text>
                </Box>
            </Box>

            <Box borderWidth="1px" borderRadius="sm" borderColor="var(--color-lavender-500)" padding={6} width="3xl" display="flex" flexDirection="column" alignItems="center" gap={4}  >
                <Box w="full" display="flex" alignItems="center" borderBottomWidth="1px" borderColor="var(--color-lavender-500)" paddingBottom={4}>
                    <Text fontSize="md">What you learned</Text>
                </Box>
                <Box w="full" display="flex" flexDirection="column" gap={2}>
                    <Text fontSize="sm">Using semantic HTML elements for interactive elements</Text>
                    <Text fontSize="sm">Ensuring proper focus management for keyboard users</Text>
                    <Text fontSize="sm">Providing accessible labels for screen readers</Text>
                </Box>
            </Box>

            <Box borderWidth="1px" borderRadius="sm" borderColor="var(--color-lavender-500)" padding={6} width="3xl" display="flex" flexDirection="column" alignItems="center" gap={4}  >
                <Box w="full" display="flex" alignItems="center" borderBottomWidth="1px" borderColor="var(--color-lavender-500)" paddingBottom={4}>
                    <Text fontSize="md">Further Reading</Text>
                </Box>
                <Box w="full" display="flex" flexDirection="column" gap={2}>
                    <Link href="#" color="var(--color-violet-eggplant-400)" variant="underline">
                        Using semantic HTML elements for interactive elements
                    </Link>
                    <Link href="#" color="var(--color-violet-eggplant-400)" variant="underline">
                        Ensuring proper focus management for keyboard users
                    </Link>
                    <Link href="#" color="var(--color-violet-eggplant-400)" variant="underline">
                        Providing accessible labels for screen readers
                    </Link>
                </Box>
            </Box>

            {challenge.id < 3 && (
                <Box width="3xl" display="flex" justifyContent="end">
                    <Link href={"/app"}>
                        <Button variant="outline" mr={4} color="var(--color-lavender-500)" borderColor="var(--color-lavender-500)" _hover={{ borderColor: "var(--color-lavender-400)", color: "var(--color-lavender-400)", bg: "transparent" }} >
                            Go Home
                        </Button>
                    </Link>
                    <Link href={`/app/quizzes/${challenge.id + 1}`}>
                        <Button variant="solid" color="var(--color-background)" bg="var(--color-lavender-500)" _hover={{ bg: "var(--color-lavender-600)", textDecor: "none" }} >
                            Next Quiz
                        </Button>
                    </Link>
                </Box>
            )}
            {challenge.id === 3 && (
                <Box width="3xl" display="flex" justifyContent="end">
                    <Link href={"/app"}>
                        <Button variant="solid" color="var(--color-background)" bg="var(--color-lavender-500)" _hover={{ bg: "var(--color-lavender-600)", textDecor: "none" }} >
                            Go Home
                        </Button>
                    </Link>
                </Box>
            )}

        </div>
    )
}