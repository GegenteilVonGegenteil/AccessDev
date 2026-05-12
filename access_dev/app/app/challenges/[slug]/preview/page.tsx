import { Box, Text, Link, Button } from "@chakra-ui/react";
import { notFound } from "next/navigation";
import { getChallengeBySlug } from "@/consts/challenges";

export default async function ChallengePreviewPage({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
    const { slug } = await params;
    const challenge = getChallengeBySlug(slug);

    if (!challenge) {
        notFound();
    }

    return (
        <div className="flex flex-col items-center justify-center gap-6 py-12 h-full w-full">
            <Box borderWidth="1px" borderRadius="sm" borderColor="var(--color-lavender-500)" padding={6} width="3xl" display="flex" flexDirection="column" alignItems="center" gap={8}  >
                <Text as="h1" fontSize="2xl" fontWeight="bold">
                    Challenge {challenge.id}: {challenge.title}
                </Text>

                <Box w="full" maxW="200px" h="4px" bgGradient="to-r" gradientFrom="var(--color-violet-eggplant-900)" gradientTo="var(--color-mantis-400)" borderRadius="full" />

                <Text fontSize="md">
                    {challenge.description}
                </Text>

                {challenge.resources && challenge.resources.length > 0 && (
                    <Box width="full" display="flex" flexDirection="column" gap={2}>
                        <Text fontSize="md" textTransform="uppercase" color="var(--color-lavender-200)">
                            Resources
                        </Text>
                        <div style={{ display: "grid", gap: "8px", padding: "8px" }}>
                            {challenge.resources.map((resource) => (
                                <Link
                                    key={resource.href}
                                    href={resource.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    color="var(--color-violet-eggplant-400)"
                                    variant="underline"
                                    _hover={{ color: "var(--color-violet-eggplant-600)" }}
                                >
                                    {resource.label}
                                </Link>
                            ))}
                        </div>
                    </Box>
                )}

                <Box width="full" display="flex" justifyContent="end">
                    <Link href={"/app"}>
                        <Button variant="outline" mr={4} color="var(--color-lavender-500)" borderColor="var(--color-lavender-500)" _hover={{ borderColor: "var(--color-lavender-400)", color: "var(--color-lavender-400)", bg: "transparent" }} >
                            Go Home
                        </Button>
                    </Link>
                    <Link href={`/app/challenges/${challenge.slug}`} _hover={{ textDecor: "none" }}>
                        <Button variant="solid" color="var(--color-background)" bg="var(--color-lavender-400)" _hover={{ bg: "var(--color-lavender-500)", textDecor: "none" }} >
                            Continue
                        </Button>
                    </Link>
                </Box>
            </Box>
        </div>
    )
}