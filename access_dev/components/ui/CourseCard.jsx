
import { Text, Box, Icon, Button } from "@chakra-ui/react";
import { MdLockOutline, MdCheck, MdPlayArrow, MdArrowRightAlt } from "react-icons/md";
import NextLink from "next/link";

// component representing a single step in the course
export default function CourseCard({ title, description, link, isLocked = false, isCompleted = false, onAction, meta }) {
    // different conditionals depending on the state of the course step (completed, next step or locked)
    const ctaLabel = isLocked ? "Locked" : isCompleted ? "Redo" : "Start";
    const StatusIcon = isLocked ? MdLockOutline : isCompleted ? MdCheck : MdPlayArrow;
    const backgoundColor = isLocked ? "var(--color-background)" : isCompleted ? "var(--color-lavender-950)" : "var(--color-violet-eggplant-950)";
    const iconColor = isLocked ? "var(--color-lavender-300)" : isCompleted ? "var(--color-text)" : "var(--color-text)";
    const iconBgColor = isLocked ? "var(--color-lavender-900)" : isCompleted ? "var(--color-lavender-900)" : "var(--color-violet-eggplant-800)";
    const textColor = isLocked ? "var(--color-lavender-600)" : isCompleted ? "var(--color-text)" : "var(--color-text)";
    const descriptionColor = isLocked ? "var(--color-lavender-500)" : isCompleted ? "var(--color-lavender-300)" : "var(--color-violet-eggplant-300)";

    // the rendered component using the conditionals above
    return (
        <Box display="flex" bg={backgoundColor} p={4} borderRadius="md" alignItems="center" gap={8} w="full">
                        <Box bgColor={iconBgColor} p={2} borderRadius="md" display="inline-flex" alignItems="center" gap={2} w="fit-content" h="fit-content">
                            <Icon size="xl" color={iconColor}>
                                <StatusIcon />
                            </Icon>
                        </Box>
                        <div className="flex flex-col w-full gap-1 items-start justify-center">
                            <Text as="h2" fontSize="2xl" fontWeight="bold" color={textColor}>
                                {title}
                            </Text>
                            <Text fontSize="md" color={descriptionColor}>
                                {isLocked ? "Complete previous challenges" : isCompleted ? null : description}
                            </Text>
                            {meta ? (
                                <Text fontSize="sm" color={descriptionColor}>
                                    {meta}
                                </Text>
                            ) : null}
                        </div>
                        {isLocked ? (
                            <Button size="lg" variant="outline" mr={4} color="var(--color-lavender-500)" borderColor="var(--color-lavender-500)" _hover={{ borderColor: "var(--color-lavender-400)", color: "var(--color-lavender-400)", bg: "transparent" }}  opacity={0.5} cursor="not-allowed" disabled>
                                {ctaLabel}
                            </Button>
                        ) : isCompleted? (
                            <Button asChild onClick={onAction} size="lg" variant="outline" mr={4} color="var(--color-lavender-300)" borderColor="var(--color-lavender-300)" _hover={{ borderColor: "var(--color-lavender-200)", color: "var(--color-lavender-200)", bg: "transparent" }} >
                                <NextLink href={link}>{ctaLabel}</NextLink>
                            </Button>
                        ) : (
                            <Button asChild onClick={onAction} size="lg" bg={iconBgColor} color="var(--color-text)" _hover={{ bg: "var(--color-violet-eggplant-900)" }} _active={{ bg: "var(--color-violet-eggplant-700)" }}>
                                <NextLink href={link}>{ctaLabel} <MdArrowRightAlt size="xl" /></NextLink>
                            </Button>
                        )}
                    </Box>
    )
}