"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { FiAlertTriangle, FiEye, FiInfo, FiX } from "react-icons/fi";
import type { Challenge } from "@/consts/structures";
import {
    Box,
    Button,
    HStack,
    IconButton,
    Link,
    SimpleGrid,
    Text,
    VStack,
} from "@chakra-ui/react";
import { LuCodeXml } from "react-icons/lu";
import {
    getPreviewDoc,
    evaluateChallengeIssues,
    getContrastMetrics,
    extractScreenReaderSimulation,
    getContrastColorTargets,
    setContrastColorTargetValue,
    type ContrastColorTargetKey,
} from "@/lib/challenge-utils";
import { markChallengeCompleted } from "@/lib/progress";

// props for the challenge runner, needs to be done because otherwise there is a type error
type ChallengeRunnerProps = {
    challenge: Challenge;
};

// for the contrast challenge, allows the user to select the object to edit with the color picker
type ContrastTargetOption = {
    key: ContrastColorTargetKey;
    label: string;
};

// for the contrast challenge, these are the options of targets to be edited with the color picker
const contrastTargetOptions: ContrastTargetOption[] = [
    { key: "title", label: "Title text" },
    { key: "body", label: "Body text" },
    { key: "buttonText", label: "Button text" },
    { key: "buttonBackground", label: "Button fill" },
];

// styling for the code editor, matching the overall design of the app
const editorTheme = EditorView.theme({
    "&": {
        height: "100%",
        backgroundColor: "#13081f",
        color: "#efe6fa",
        borderRadius: "16px",
        overflow: "hidden",
    },
    ".cm-scroller": {
        fontFamily: "var(--font-mono)",
        lineHeight: "1.7",
    },
    ".cm-content": {
        caretColor: "#f5f3ff",
        padding: "16px 0",
    },
    ".cm-gutters": {
        backgroundColor: "#0f051b",
        color: "#a78bfa",
        border: "none",
    },
    ".cm-activeLine, .cm-activeLineGutter": {
        backgroundColor: "rgba(167, 139, 250, 0.08)",
    },
    ".cm-cursor, .cm-dropCursor": {
        borderLeftColor: "#f5f3ff",
    },
    ".cm-selectionBackground, .cm-content ::selection": {
        backgroundColor: "rgba(167, 139, 250, 0.35) !important",
    },
    ".cm-placeholder": {
        color: "rgba(239, 230, 250, 0.45)",
    },
});

// the actual challenge runner component rendering the editor, preview, error and hint sections
export default function ChallengeRunner({ challenge }: ChallengeRunnerProps) {

    // router for navigation to the success page after completing the challenge
    const router = useRouter();
    // references to the editor host and view, needed for CodeMirror
    const editorHostRef = useRef<HTMLDivElement | null>(null);
    const editorViewRef = useRef<EditorView | null>(null);

    // state holding the code in the editor, initialized with the given code of a challenge
    const [code, setCode] = useState(challenge.starterCode);

    // tracker for the revealed hints
    const [revealedHints, setRevealedHints] = useState<Set<number>>(new Set());

    // state for whether the challenge info modal is open
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    
    // checking if the component is mounted (done due to hydration issues)
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);

    // for the contrast challenge, hold the current target for the color picker, default is the title element
    const [selectedContrastTarget, setSelectedContrastTarget] = useState<ContrastColorTargetKey>("title");

    // initialization of the CodeMirror editor, done once the component is mounted
    useEffect(() => {
        // get the host element for the editor
        const host = editorHostRef.current;

        // if the host is not available or the editor view is already initialized, do nothing
        if (!host || editorViewRef.current) {
            return undefined;
        }

        // create the editor state using the starter code of the challenge and the predefined theme and setup
        const state = EditorState.create({
            doc: challenge.starterCode,
            extensions: [
                basicSetup,
                editorTheme,
                // update the code state on changes, this allows for the preview to update and the errors to be evaluated
                EditorView.updateListener.of((update) => {
                    if (update.docChanged) {
                        setCode(update.state.doc.toString());
                    }
                }),
            ],
        });

        // create the editor view and attach it to the host element
        editorViewRef.current = new EditorView({
            state,
            parent: host,
        });

        // cleanup function to destroy the editor view when the component is unmounted
        return () => {
            editorViewRef.current?.destroy();
            editorViewRef.current = null;
        };
    }, [challenge.starterCode]);

    // update the editor view when the code state changes, used for the reset and the color picker in the contrast challenge
    useEffect(() => {
        // get the current editor view
        const view = editorViewRef.current;

        if (!view) {
            return;
        }

        // get the current code in the editor
        const currentCode = view.state.doc.toString();

        // if the current code is the same as the new code, do nothing
        if (currentCode === code) {
            return;
        }

        // update the editor view with the new code
        view.dispatch({
            changes: {
                from: 0,
                to: currentCode.length,
                insert: code,
            },
        });
    }, [code]);

    // get the preview document for the iframe
    const previewDoc = useMemo(() => getPreviewDoc(challenge, code), [challenge, code]);

    // get the resolved issues
    const resolvedIssues = useMemo(() => evaluateChallengeIssues(challenge, code), [challenge, code]);

    // filter all challenge errors to only show the unresolved ones, used to only render relevant errors
    const activeErrors = useMemo(
        () => challenge.errors.filter((_, index) => !resolvedIssues[index]),
        [challenge.errors, resolvedIssues]
    );

    // for the contrast chalenge, get the contrast ratios of the currently applied colors
    const contrastMetrics = useMemo(() => {
        if (challenge.type !== "contrast" || !isMounted) {
            return null;
        }

        return getContrastMetrics(code);
    }, [challenge.type, code, isMounted]);

    // for the contrast challenge, get the current color values of the targets to be edited with the color picker
    const contrastColorTargets = useMemo(() => {
        if (challenge.type !== "contrast" || !isMounted) {
            return null;
        }

        return getContrastColorTargets(code);
    }, [challenge.type, code, isMounted]);

    // for the screen reader challenge, get the simulated screen reader output for the current code
    const screenReaderSimulation = useMemo(() => {
        if (challenge.type !== "screen-reader" || !isMounted) {
            return null;
        }

        return extractScreenReaderSimulation(code, challenge);
    }, [challenge, code, isMounted]);

    // handles the completion of the challenge, which is called when teh user clicks the associated button
    const handleContinueToSuccess = () => {
        // count how many issues were resolved
        const resolved = resolvedIssues.filter(Boolean).length;
        // count how many hints were revealed
        const hintsUsed = revealedHints.size;
        // save progress in local storage
        markChallengeCompleted(challenge.slug, resolved, challenge.errors.length, hintsUsed);
        // navigate to the success page of the challenge
        router.push(`/app/challenges/${challenge.slug}/success`);
    };

    // reset of code 
    const handleReset = () => {
        // set the code state to the starter code
        setCode(challenge.starterCode);

        // get the current view
        const view = editorViewRef.current;

        if (!view) {
            return;
        }

        // update the editor view with the starter code
        view.dispatch({
            changes: {
                from: 0,
                to: view.state.doc.length,
                insert: challenge.starterCode,
            },
        });
    };

    // close the challenge info modal when the escape key is pressed
    useEffect(() => {
        if (!isInfoOpen) {
            return undefined;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsInfoOpen(false);
            }
        };

        // add the event listener for keydown events
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isInfoOpen]);

    // for the contrast challenge, handle the color change of the selected target using the color picker, updates the code state with the new color value
    const handleContrastColorChange = (nextColor: string) => {
        setCode((currentCode) => setContrastColorTargetValue(currentCode, selectedContrastTarget, nextColor));
    };

    // reveal a hint, adds the index of the hint to the set of revealed hints
    const revealHint = (index: number) => {
        const newRevealed = new Set(revealedHints);
        newRevealed.add(index);
        setRevealedHints(newRevealed);
    };

    // get the currently selected color value for the contrast challenge, used to set the value of the color picker
    const selectedContrastColor =
        contrastColorTargets?.[selectedContrastTarget] ?? "#000000";

    // render the challenge runner component
    return (
        <Box maxW="7xl" mx="auto" w="full" px={{ base: 4, lg: 0 }} py={{ base: 8, lg: 10 }} color="var(--color-text)">
            <VStack align="stretch" gap={8}>
                <HStack align="flex-start" justify="space-between" gap={4}>
                    <VStack align="start" gap={2}>
                        <Text as="h1" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold">
                            Challenge {challenge.id}: {challenge.title}
                        </Text>
                        <Text maxW="3xl" color="var(--color-lavender-200)">
                            {challenge.objective}
                        </Text>
                    </VStack>

                    <HStack gap={2} flexShrink={0}>
                        {/* button to end the challenge */}
                        <Button
                            onClick={handleContinueToSuccess}
                            variant="solid"
                            color="var(--color-background)"
                            bg="var(--color-lavender-400)"
                            _hover={{ bg: "var(--color-lavender-500)", textDecor: "none" }}
                        >
                            End Challenge
                        </Button>
                        {/* button to open the information modal */}
                        <IconButton
                            aria-label="Challenge information"
                            rounded="full"
                            background="transparent"
                            onClick={() => setIsInfoOpen(true)}
                        >
                            <FiInfo className="h-5 w-5" />
                        </IconButton>
                    </HStack>
                </HStack>

                {/* the editor and preview */}
                <SimpleGrid columns={{ base: 1, lg: 2 }} gap={5} alignItems="stretch">
                    <Box borderWidth="1px" borderColor="var(--color-lavender-500)" borderRadius="2xl" overflow="hidden" bg="var(--color-background)" display="flex" flexDirection="column" minH={{ base: "14rem", lg: "18rem" }} maxH={{ base: "26rem", lg: "32rem" }}>
                        <HStack justify="space-between" borderBottomWidth="1px" borderColor="var(--color-lavender-500)" px={5} py={4}>
                            <HStack gap={3} color="var(--color-lavender-100)">
                                <LuCodeXml />
                                <Text fontFamily="var(--font-mono)" fontSize="sm">index.html</Text>
                            </HStack>
                            {/* Reset Button */}
                            <Button type="button" onClick={handleReset} variant="outline" color="var(--color-lavender-500)" borderColor="var(--color-lavender-500)" _hover={{ borderColor: "var(--color-lavender-400)", color: "var(--color-lavender-400)", bg: "transparent" }}>
                                Reset
                            </Button>
                        </HStack>

                        <Box p={3} flex="1" minH={0} display="flex" flexDirection="column" gap={3}>
                            {/* the editor */}
                            <Box
                                ref={editorHostRef}
                                flex="1"
                                minH={0}
                                maxH="100%"
                                overflowY="auto"
                                borderRadius="xl"
                                borderWidth="1px"
                                borderColor="whiteAlpha.100"
                            />

                            {/* colour picker section for the contrast challenge */}
                            {challenge.type === "contrast" ? (
                                <VStack align="stretch" gap={3} p={3} borderWidth="1px" borderColor="var(--color-lavender-500)" borderRadius="xl">
                                    <VStack align="start" gap={1}>
                                        <Text fontFamily="var(--font-mono)" fontSize="sm" textTransform="uppercase" letterSpacing="0.05em" color="var(--color-lavender-100)">
                                            Color wheel
                                        </Text>
                                        <Text fontSize="sm" color="var(--color-lavender-200)">
                                            Pick a target, then adjust the color in the editor.
                                        </Text>
                                    </VStack>

                                    {/* the target options for the color picker */}
                                    <SimpleGrid columns={{ base: 2, md: 4 }} gap={2}>
                                        {contrastTargetOptions.map((target) => (
                                            <Button
                                                key={target.key}
                                                type="button"
                                                onClick={() => setSelectedContrastTarget(target.key)}
                                                variant={selectedContrastTarget === target.key ? "solid" : "outline"}
                                                color={selectedContrastTarget === target.key ? "var(--color-text)" : "var(--color-lavender-100)"}
                                                bg={selectedContrastTarget === target.key ? "var(--color-lavender-900)" : "transparent"}
                                                borderColor="var(--color-lavender-500)"
                                                _hover={{ bg: "var(--color-lavender-950)" }}
                                            >
                                                {target.label}
                                            </Button>
                                        ))}
                                    </SimpleGrid>

                                    {/* the colour picker */}
                                    <Box>
                                        <Text fontSize="sm" color="var(--color-lavender-200)" mb={2}>
                                            Hex color picker
                                        </Text>
                                        <input
                                            type="color"
                                            value={selectedContrastColor}
                                            onChange={(event) => handleContrastColorChange(event.target.value)}
                                            style={{ width: "100%", height: "5rem", padding: 4, background: "transparent", cursor: "pointer" }}
                                        />
                                    </Box>
                                </VStack>
                            ) : null}
                        </Box>
                    </Box>

                    {/* the preview */}
                    <Box borderWidth="1px" borderColor="var(--color-lavender-500)" borderRadius="2xl" overflow="hidden" bg="var(--color-background)" display="flex" flexDirection="column" minH={{ base: "14rem", lg: "18rem" }} maxH={{ base: "26rem", lg: "32rem" }}>
                        <HStack gap={3} borderBottomWidth="1px" borderColor="var(--color-lavender-500)" px={5} py={4} color="var(--color-lavender-100)">
                            <FiEye />
                            <Text fontFamily="var(--font-mono)" fontSize="sm">Preview</Text>
                        </HStack>

                        {/* screen reader simulation */}
                        {screenReaderSimulation ? (
                            <VStack align="stretch" gap={3} p={3} flex="1" minH={0} bg="var(--color-lavender-50)" height="100%">
                                <Box flex="1" minH={0} overflow="auto" borderWidth="1px" borderColor="var(--color-lavender-500)" borderRadius="xl" p={4} bg="var(--color-background)">
                                    <Text fontFamily="var(--font-mono)" fontSize="sm" textTransform="uppercase" letterSpacing="0.05em" color="var(--color-lavender-100)" mb={3}>
                                        Screen Reader Output
                                    </Text>
                                    <VStack align="stretch" gap={2}>
                                        {/* all heading lines */}
                                        {screenReaderSimulation.headingLines.map((line: string) => (
                                            <Box key={line} borderRadius="xl" borderWidth="1px" borderColor="var(--color-lavender-500)" bg="var(--color-lavender-950)" px={4} py={3} fontSize="sm">
                                                {line}
                                            </Box>
                                        ))}
                                        {/* all input lines */}
                                        {screenReaderSimulation.inputLines.map((line: string) => (
                                            <Box key={line} borderRadius="xl" borderWidth="1px" borderColor="var(--color-lavender-500)" bg="var(--color-lavender-950)" px={4} py={3} fontSize="sm">
                                                {line}
                                            </Box>
                                        ))}
                                        {/* all button lines */}
                                        {screenReaderSimulation.buttonLines.map((line: string) => (
                                            <Box key={line} borderRadius="xl" borderWidth="1px" borderColor="var(--color-lavender-500)" bg="var(--color-lavender-950)" px={4} py={3} fontSize="sm">
                                                {line}
                                            </Box>
                                        ))}
                                        {/* status region */}
                                        <Box borderRadius="xl" borderWidth="1px" borderColor="var(--color-lavender-500)" bg="var(--color-lavender-950)" px={4} py={3} fontSize="sm">
                                            <strong>Status region:</strong> {screenReaderSimulation.liveText}
                                        </Box>
                                    </VStack>
                                </Box>
                            </VStack>
                        ) : (
                            <VStack align="stretch" gap={3} p={3} flex="1" minH={0} bg="var(--color-lavender-50)" height="100%">
                                {/* other challenges use iframe for simulation */}
                                {/* indicators for current contrast ratios */}
                                {contrastMetrics ? (
                                    <HStack gap={2} flexWrap="wrap" borderBottomWidth="1px" borderColor="rgba(255,255,255,0.08)" bg="rgba(255,255,255,0.04)" px={3} py={2} borderRadius="xl">
                                        <Box px={3} py={2} borderRadius="lg" bg="var(--color-background)" borderWidth="1px" borderColor="var(--color-lavender-500)" fontSize="sm">
                                            Title: {contrastMetrics.title ? `${contrastMetrics.title.toFixed(2)}:1` : "n/a"}
                                        </Box>
                                        <Box px={3} py={2} borderRadius="lg" bg="var(--color-background)" borderWidth="1px" borderColor="var(--color-lavender-500)" fontSize="sm">
                                            Body: {contrastMetrics.body ? `${contrastMetrics.body.toFixed(2)}:1` : "n/a"}
                                        </Box>
                                        <Box px={3} py={2} borderRadius="lg" bg="var(--color-background)" borderWidth="1px" borderColor="var(--color-lavender-500)" fontSize="sm">
                                            Button: {contrastMetrics.button ? `${contrastMetrics.button.toFixed(2)}:1` : "n/a"}
                                        </Box>
                                    </HStack>
                                ) : null}
                                {/* iframe for the preview */}
                                <Box flex="1" minH={0} borderRadius="xl" overflow="hidden" borderWidth="1px" borderColor="var(--color-lavender-500)" height="100%">
                                    <iframe title={`${challenge.title} preview`} sandbox="allow-scripts allow-modals" style={{ width: "100%", height: "100%", border: 0, background: "white", display: "block" }} srcDoc={previewDoc} />
                                </Box>
                            </VStack>
                        )}
                    </Box>
                </SimpleGrid>
                
                {/* hints and errors */}
                <SimpleGrid columns={{ base: 1, lg: 2 }} gap={5}>
                    <Box borderWidth="1px" borderColor="var(--color-lavender-500)" borderRadius="2xl" overflow="hidden" bg="var(--color-background)">
                        <HStack gap={3} borderBottomWidth="1px" borderColor="var(--color-lavender-500)" px={5} py={4} color="var(--color-lavender-100)">
                            <FiAlertTriangle />
                            <Text fontFamily="var(--font-mono)" fontSize="sm">Errors</Text>
                        </HStack>
                        <VStack align="stretch" gap={3} p={5}>
                            {activeErrors.length === 0 ? (
                                <Box borderRadius="xl" borderWidth="1px" borderColor="var(--color-lavender-500)" bg="var(--color-lavender-950)" px={4} py={3} fontSize="sm">
                                    All current issues resolved.
                                </Box>
                            ) : activeErrors.map((error) => (
                                <Box key={error} borderRadius="xl" borderWidth="1px" borderColor="var(--color-violet-eggplant-400)" bg="var(--color-violet-eggplant-950)" px={4} py={3} fontSize="sm">
                                    {error}
                                </Box>
                            ))}
                        </VStack>
                    </Box>

                    <Box borderWidth="1px" borderColor="var(--color-lavender-500)" borderRadius="2xl" overflow="hidden" bg="var(--color-background)">
                        <HStack gap={3} borderBottomWidth="1px" borderColor="var(--color-lavender-500)" px={5} py={4} color="var(--color-lavender-100)">
                            <FiInfo />
                            <Text fontFamily="var(--font-mono)" fontSize="sm">Hints</Text>
                        </HStack>
                        <VStack align="stretch" gap={3} p={5}>
                            {challenge.hints.map((hint, index) => (
                                revealedHints.has(index) ? (
                                    <Box key={index} borderRadius="xl" borderWidth="1px" borderColor="var(--color-lavender-500)" bg="var(--color-lavender-950)" px={4} py={3} fontSize="sm">
                                        {hint}
                                    </Box>
                                ) : (
                                    <Button
                                        key={index}
                                        type="button"
                                        onClick={() => revealHint(index)}
                                        variant="solid"
                                        bg="var(--color-lavender-700)"
                                        color="var(--color-text)"
                                        justifyContent="flex-start"
                                        _hover={{ bg: "var(--color-lavender-800)" }}
                                    >
                                        Hint {index + 1}
                                    </Button>
                                )
                            ))}
                        </VStack>
                    </Box>
                </SimpleGrid>
            </VStack>
            
            {/* modal info dialogue */}
            {isInfoOpen ? (
                <Box
                    position="fixed"
                    inset={0}
                    zIndex={50}
                    display="grid"
                    placeItems="center"
                    px={4}
                    py={6}
                    bg="rgba(5, 8, 20, 0.72)"
                    backdropFilter="blur(10px)"
                    onClick={() => setIsInfoOpen(false)}
                >
                    <Box
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="challenge-info-title"
                        aria-describedby="challenge-info-description"
                        w="min(720px, 100%)"
                        maxH="min(80vh, 820px)"
                        overflow="auto"
                        borderWidth="1px"
                        borderColor="var(--color-lavender-500)"
                        borderRadius="2xl"
                        bg="var(--color-background)"
                        color="var(--color-text)"
                        shadow="0 24px 80px rgba(0, 0, 0, 0.45)"
                        p={6}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <HStack justify="space-between" align="center" gap={4} mb={5}>
                            <Text id="challenge-info-title" as="h2" fontSize="xl" fontWeight="semibold">
                                Challenge {challenge.id}: {challenge.title}
                            </Text>
                            <IconButton aria-label="Close challenge details" rounded="full" background="transparent" onClick={() => setIsInfoOpen(false)}>
                                <FiX className="h-5 w-5" />
                            </IconButton>
                        </HStack>

                        <VStack id="challenge-info-description" align="stretch" gap={6}>
                            <Text>{challenge.objective}</Text>

                            {challenge.resources && challenge.resources.length > 0 ? (
                                <Box>
                                    <Text fontSize="sm" textTransform="uppercase" letterSpacing="0.08em" color="var(--color-lavender-200)" mb={3}>
                                        Resources
                                    </Text>
                                    <VStack align="stretch" gap={2} px={2}>
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
                                    </VStack>
                                </Box>
                            ) : null}
                        </VStack>
                    </Box>
                </Box>
            ) : null}
        </Box>
    );
}
