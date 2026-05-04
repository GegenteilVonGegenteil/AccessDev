"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { FiAlertTriangle, FiEye, FiInfo } from "react-icons/fi";
import type { ChallengeDefinition } from "@/consts/challenges";
import { Button, Icon, IconButton, Text } from "@chakra-ui/react";
import { LuCodeXml } from "react-icons/lu";
import "./challenge-runner.css";

type ChallengeRunnerProps = {
    challenge: ChallengeDefinition;
};

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

function getInitialHintCount(totalHints: number) {
    return totalHints > 0 ? 1 : 0;
}

function getPreviewDoc(challenge: ChallengeDefinition, code: string) {
    if (challenge.type === "keyboard-navigation") {
        return code.replace(
                        "</head>",
                        `<style>
                body {
                  pointer-events: none !important;
                }

                button,
                a,
                input,
                select,
                textarea,
                [role="button"],
                [tabindex]:not([tabindex="-1"]) {
                    pointer-events: auto !important;
                    cursor: pointer !important;
                }

                :focus-visible {
                    outline: 3px solid #7c3aed;
                    outline-offset: 4px;
                }
            </style>
</head>`
                );
    }

        if (challenge.type === "screen-reader") {
                return code;
        }

    if (challenge.type === "contrast") {
        return code.replace(
            "</head>",
            `<style>
        html,
        body,
        body * {
          filter: blur(2.8px) saturate(0.8) brightness(0.92);
        }

        body {
          overflow: hidden;
        }

        body::after {
          content: "Contrast barrier active";
          position: fixed;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          padding: 12px 16px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.7);
          color: #4c1d95;
          font: 600 0.85rem/1.2 Inter, Arial, sans-serif;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          filter: none;
        }
      </style>
</head>`
        );
    }

    return code;
}

function stripTags(value: string) {
    return value
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/\s+/g, " ")
        .trim();
}

function extractScreenReaderSimulation(code: string, challenge: ChallengeDefinition) {
    const headingLines: string[] = [];
    const buttonLines: string[] = [];
    const warnings: string[] = [];

    const headingRegex = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi;
    let headingMatch = headingRegex.exec(code);
    let previousLevel = 0;

    while (headingMatch) {
        const level = Number.parseInt(headingMatch[1], 10);
        const text = stripTags(headingMatch[2]);

        if (text.length > 0) {
            headingLines.push(`Heading level ${level}: ${text}`);
        }

        if (previousLevel > 0 && level - previousLevel > 1) {
            warnings.push(`Heading level jumps from ${previousLevel} to ${level}.`);
        }

        previousLevel = level;
        headingMatch = headingRegex.exec(code);
    }

    const buttonRegex = /<button([^>]*)>([\s\S]*?)<\/button>/gi;
    let buttonMatch = buttonRegex.exec(code);

    while (buttonMatch) {
        const attributes = buttonMatch[1] ?? "";
        const content = buttonMatch[2] ?? "";
        const ariaLabelMatch = /aria-label\s*=\s*(["'])(.*?)\1/i.exec(attributes);
        const accessibleName = (ariaLabelMatch?.[2] ?? stripTags(content)).trim();

        if (accessibleName.length > 0) {
            buttonLines.push(`Button: ${accessibleName}`);
        } else {
            buttonLines.push("Button: unlabeled");
            warnings.push("At least one button has no accessible name.");
        }

        buttonMatch = buttonRegex.exec(code);
    }

    const liveRegex = /<([a-z0-9-]+)([^>]*\saria-live\s*=\s*(["'])(.*?)\3[^>]*)>([\s\S]*?)<\/\1>/i;
    const liveMatch = liveRegex.exec(code);
    const liveText = liveMatch ? stripTags(liveMatch[5]) : "No live region found.";

    if (!liveMatch) {
        warnings.push("No aria-live region found for status updates.");
    }

    return {
        headingLines,
        buttonLines,
        liveText,
        warnings,
        introTitle: challenge.previewTitle,
        introDescription: challenge.previewDescription,
    };
}

export default function ChallengeRunner({ challenge }: ChallengeRunnerProps) {
    const editorHostRef = useRef<HTMLDivElement | null>(null);
    const editorViewRef = useRef<EditorView | null>(null);
    const [code, setCode] = useState(challenge.starterCode);
    const [revealedHints, setRevealedHints] = useState<Set<number>>(new Set());

    useEffect(() => {
        const host = editorHostRef.current;

        if (!host || editorViewRef.current) {
            return undefined;
        }

        const state = EditorState.create({
            doc: challenge.starterCode,
            extensions: [
                basicSetup,
                editorTheme,
                EditorView.updateListener.of((update) => {
                    if (update.docChanged) {
                        setCode(update.state.doc.toString());
                    }
                }),
            ],
        });

        editorViewRef.current = new EditorView({
            state,
            parent: host,
        });

        return () => {
            editorViewRef.current?.destroy();
            editorViewRef.current = null;
        };
    }, [challenge.starterCode]);

    useEffect(() => {
        const view = editorViewRef.current;

        if (!view) {
            return;
        }

        const currentCode = view.state.doc.toString();

        if (currentCode === code) {
            return;
        }

        view.dispatch({
            changes: {
                from: 0,
                to: currentCode.length,
                insert: code,
            },
        });
    }, [code]);

    const previewDoc = useMemo(() => getPreviewDoc(challenge, code), [challenge, code]);
    const screenReaderSimulation = useMemo(() => {
        if (challenge.type !== "screen-reader") {
            return null;
        }

        return extractScreenReaderSimulation(code, challenge);
    }, [challenge, code]);

    const handleReset = () => {
        setCode(challenge.starterCode);
        setRevealedHints(new Set());

        const view = editorViewRef.current;

        if (!view) {
            return;
        }

        view.dispatch({
            changes: {
                from: 0,
                to: view.state.doc.length,
                insert: challenge.starterCode,
            },
        });
    };

    const revealHint = (index: number) => {
        const newRevealed = new Set(revealedHints);
        newRevealed.add(index);
        setRevealedHints(newRevealed);
    };

    return (
        <div className="challenge-runner">
            <div className="challenge-runner__header">
                <Text as="h1" fontSize="2xl">Challenge {challenge.id}: {challenge.title}</Text>
                <IconButton aria-label="Challenge information" rounded="full" background="transparent">
                    <FiInfo className="h-5 w-5" />
                </IconButton>
            </div>

            <div className="challenge-runner__grid">
                <section className="challenge-runner__section">
                    <div className="challenge-runner__section-header">
                        <div className="challenge-runner__section-title">
                            <LuCodeXml />
                            <span>index.html</span>
                        </div>
                        <Button
                            type="button"
                            onClick={handleReset}
                            variant="outline"
                            rounded="full"
                            borderColor="var(--color-lavender-300)"
                            color="var(--color-lavender-300)"
                            _hover={{ bg: "var(--color-lavender-950)" }}
                        >
                            Reset
                        </Button>
                    </div>
                    <div className="challenge-runner__editor-container">
                        <div ref={editorHostRef} className="challenge-runner__editor-host" />
                    </div>
                </section>

                <section className="challenge-runner__section">
                    <div className="challenge-runner__section-header challenge-runner__section-header--alt">
                        <div className="challenge-runner__section-title">
                            <FiEye className="challenge-runner__icon" />
                            <span>Preview</span>
                        </div>
                    </div>
                    {screenReaderSimulation ? (
                        <div className="challenge-runner__preview-container">
                            <div className="challenge-runner__simulated-output" aria-live="polite">
                                <div className="challenge-runner__simulated-title">Simulated Screen Reader Output</div>
                                {screenReaderSimulation.headingLines.map((line) => (
                                    <div key={line} className="challenge-runner__simulated-line">{line}</div>
                                ))}
                                {screenReaderSimulation.buttonLines.map((line) => (
                                    <div key={line} className="challenge-runner__simulated-line">{line}</div>
                                ))}
                                <div className="challenge-runner__simulated-line">
                                    <strong>Status region:</strong> {screenReaderSimulation.liveText}
                                </div>
                                {screenReaderSimulation.warnings.map((warning) => (
                                    <div key={warning} className="challenge-runner__simulated-warning">{warning}</div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="challenge-runner__preview-container">
                            <iframe
                                title={`${challenge.title} preview`}
                                sandbox="allow-scripts allow-modals"
                                className="challenge-runner__preview-iframe"
                                srcDoc={previewDoc}
                            />
                        </div>
                    )}
                </section>
            </div>

            <div className="challenge-runner__grid">
                <section className="challenge-runner__section">
                    <div className="challenge-runner__section-header challenge-runner__section-header--alt">
                        <div className="challenge-runner__section-title">
                            <FiAlertTriangle className="challenge-runner__icon" />
                            <span>Errors</span>
                        </div>
                    </div>
                    <div className="challenge-runner__content">
                        {challenge.errors.map((error) => (
                            <div key={error} className="challenge-runner__error-item">
                                {error}
                            </div>
                        ))}
                    </div>
                </section>

                <section className="challenge-runner__section">
                    <div className="challenge-runner__section-header challenge-runner__section-header--alt">
                        <div className="challenge-runner__section-title">
                            <FiInfo className="challenge-runner__icon" />
                            <span>Hints</span>
                        </div>
                    </div>
                    <div className="challenge-runner__content">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {challenge.hints.map((hint, index) => (
                                revealedHints.has(index) ? (
                                    <div key={index} className="challenge-runner__hint-item">
                                        {hint}
                                    </div>
                                ) : (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => revealHint(index)}
                                        className="challenge-runner__reveal-btn"
                                    >
                                        Hint {index + 1}
                                    </button>
                                )
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}