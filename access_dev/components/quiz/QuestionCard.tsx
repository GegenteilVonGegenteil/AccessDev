"use client";

import type { Quiz } from "@/consts/structures";
import { Box, Text, RadioCard, Button } from "@chakra-ui/react";

export default function QuestionCard({ quiz }: { quiz: Quiz }) {
    return (
        <Box w="3xl" borderWidth="1px" borderRadius="lg" borderColor="var(--color-lavender-500)" p={6} display="flex" flexDirection="column" gap={6} alignItems="center">
            <Text as="h2" fontSize="2xl" maxW="3/4" textAlign="center" fontWeight="semibold" mb={4}>
                {quiz.questions[0].text}
            </Text>
            <Box w="full" maxW="200px" h="4px" bgGradient="to-r" gradientFrom="var(--color-violet-eggplant-900)" gradientTo="var(--color-mantis-400)" borderRadius="full" />
            {quiz.questions[0].options.map((option) => (
                <RadioCard.Root key={option.id} w="full" maxW="2xl" cursor="pointer" borderRadius="lg" bgColor="var(--color-lavender-950)" borderColor="transparent">
                    <RadioCard.Item key={option.id} value={option.id} borderColor="transparent" bgColor="var(--color-lavender-950)" _hover={{ bgColor: "var(--color-lavender-900)" }} _checked={{ borderColor: "var(--color-lavender-500)" }} >
                        <RadioCard.ItemHiddenInput />
                        <RadioCard.ItemControl>
                            <RadioCard.ItemIndicator _checked={{ bg: "var(--color-lavender-500)" }} />
                            <RadioCard.ItemContent>
                                <RadioCard.ItemText fontSize="lg" fontWeight="medium">
                                    {option.text}
                                </RadioCard.ItemText>
                            </RadioCard.ItemContent>
                        </RadioCard.ItemControl>
                    </RadioCard.Item>
                </RadioCard.Root>
            ))}
            <div className="flex w-full justify-end">
                <Button size="md" mt={4} onClick={() => alert("Answer submitted!")} variant="solid" color="var(--color-background)" bg="var(--color-lavender-400)" _hover={{ bg: "var(--color-lavender-500)", textDecor: "none" }}>
                    Submit
                </Button>
            </div>
        </Box>
    )
}