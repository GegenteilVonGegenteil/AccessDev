"use client";

import type { Question } from "@/consts/structures";
import { Box, Button, RadioCard, Text } from "@chakra-ui/react";

// properties relating to a single question and the ability to answer it
type QuestionCardProps = {
    question: Question;
    selectedOptionId: string | null;
    onSelectOption: (optionId: string) => void;
    onSubmit: () => void;
    isSubmitDisabled?: boolean;
};

// the component rendering the question and all associated answers
export default function QuestionCard({
    question,
    selectedOptionId,
    onSelectOption,
    onSubmit,
    isSubmitDisabled = false,
}: QuestionCardProps) {
    return (
        <Box
            w="3xl"
            borderWidth="1px"
            borderRadius="lg"
            borderColor="var(--color-lavender-500)"
            p={6}
            display="flex"
            flexDirection="column"
            gap={6}
            alignItems="center"
        >
            <Text as="h2" fontSize="2xl" maxW="3/4" textAlign="center" fontWeight="semibold" mb={4}>
                {question.text}
            </Text>
            <Box w="full" maxW="200px" h="4px" bgGradient="to-r" gradientFrom="var(--color-violet-eggplant-900)" gradientTo="var(--color-mantis-400)" borderRadius="full" />
            {/* Chakra Root object for radio cards, changes selected option on change */}
            <RadioCard.Root
                w="full"
                maxW="2xl"
                value={selectedOptionId ?? undefined}
                onValueChange={(details) => {
                    if (details.value) {
                        onSelectOption(details.value);
                    }
                }}
                onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") {
                        const input = e.target as HTMLInputElement;
                        if (input.type === "radio") {
                            input.click();
                        }
                    }
                }}
            >
                <Box w="full" display="flex" flexDirection="column" gap={3}>
                    {/* answer options as radio cards*/}
                    {question.options.map((option) => (
                        <RadioCard.Item
                            key={option.id}
                            value={option.id}
                            w="full"
                            cursor="pointer"
                            borderRadius="lg"
                            borderWidth="1px"
                            borderColor="transparent"
                            bgColor="var(--color-lavender-950)"
                            _hover={{ bgColor: "var(--color-lavender-900)" }}
                            _checked={{ borderColor: "var(--color-lavender-500)", bgColor: "var(--color-lavender-900)" }}
                            _focusWithin={{ outline: "2px solid var(--color-lavender-500)", outlineOffset: "2px" }}

                        >
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
                    ))}
                </Box>
            </RadioCard.Root>
            <div className="flex w-full justify-end">
                <Button
                    size="md"
                    mt={4}
                    onClick={onSubmit}
                    disabled={isSubmitDisabled}
                    variant="solid"
                    color="var(--color-background)"
                    bg="var(--color-lavender-400)"
                    _hover={{ bg: "var(--color-lavender-500)", textDecor: "none" }}
                >
                    Submit
                </Button>
            </div>
        </Box>
    );
}