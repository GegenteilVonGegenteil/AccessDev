
import { Text, Box, Icon, Button } from "@chakra-ui/react";
import { MdLockOutline, MdCheck, MdPlayArrow, MdArrowRightAlt } from "react-icons/md";

export default function CourseCard({ title, description, link, isLocked = false, isCompleted = false, onAction }) {
    const ctaLabel = isLocked ? "Locked" : isCompleted ? "Redo" : "Start";
    const StatusIcon = isLocked ? MdLockOutline : isCompleted ? MdCheck : MdPlayArrow;
    const backgoundColor = isLocked ? "var(--color-background)" : isCompleted ? "var(--color-lavender-950)" : "var(--color-violet-eggplant-950)";
    const iconColor = isLocked ? "var(--color-lavender-300)" : isCompleted ? "var(--color-text)" : "var(--color-text)";
    const iconBgColor = isLocked ? "var(--color-lavender-900)" : isCompleted ? "var(--color-lavender-900)" : "var(--color-violet-eggplant-800)";
    const textColor = isLocked ? "var(--color-lavender-600)" : isCompleted ? "var(--color-text)" : "var(--color-text)";
    const descriptionColor = isLocked ? "var(--color-lavender-700)" : isCompleted ? "var(--color-lavender-300)" : "var(--color-violet-eggplant-300)";

    return (
        <Box display="flex" bg={backgoundColor} p={4} borderRadius="md" alignItems="center" gap={8} w="full">
                        <Box bgColor={iconBgColor} p={2} borderRadius="md" display="inline-flex" alignItems="center" gap={2} w="fit-content" h="fit-content">
                            <Icon size="xl" color={iconColor}>
                                <StatusIcon />
                            </Icon>
                        </Box>
                        <div className="flex flex-col w-full gap-2 items-start justify-center">
                            <Text fontSize="2xl" fontWeight="bold" color={textColor} textAlign="center">
                                {title}
                            </Text>
                            <Text fontSize="md" color={descriptionColor} textAlign="center">
                                {description}
                            </Text>
                        </div>
                        {isLocked ? (
                            <Button size="lg" bg="transparent" color="var(--color-text)" variant="outline" border="1px solid var(--color-text)" opacity={0.5} cursor="not-allowed" disabled>
                                {ctaLabel}
                            </Button>
                        ) : isCompleted? (
                            <Button asChild onClick={onAction} size="lg" bg="transparent" color="var(--color-text)" variant="outline" border="1px solid var(--color-text)" _hover={{ bg: "var(--color-lavender-900)" }} _active={{ bg: "var(--color-lavender-800)" }}>
                                <a href={link}>{ctaLabel}</a>
                            </Button>
                        ) : (
                            <Button asChild onClick={onAction} size="lg" bg={iconBgColor} color="var(--color-text)" _hover={{ bg: "var(--color-violet-eggplant-900)" }} _active={{ bg: "var(--color-violet-eggplant-700)" }}>
                                <a href={link}>{ctaLabel} <MdArrowRightAlt size="xl" /></a>
                            </Button>
                        )}
                    </Box>
    )
}