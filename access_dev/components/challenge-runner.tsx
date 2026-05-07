"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { FiAlertTriangle, FiEye, FiInfo } from "react-icons/fi";
import type { ChallengeDefinition } from "@/consts/challenges";
import { Button, IconButton, Text } from "@chakra-ui/react";
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
import "./challenge-runner.css";

type ChallengeRunnerProps = {
    challenge: ChallengeDefinition;
};

type ContrastTargetOption = {
    key: ContrastColorTargetKey;
    label: string;
};

const contrastTargetOptions: ContrastTargetOption[] = [
    { key: "title", label: "Title text" },
    { key: "body", label: "Body text" },
    { key: "buttonText", label: "Button text" },
    { key: "buttonBackground", label: "Button fill" },
];

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

export default function ChallengeRunner({ challenge }: ChallengeRunnerProps) {
    const router = useRouter();
    const editorHostRef = useRef<HTMLDivElement | null>(null);
    const editorViewRef = useRef<EditorView | null>(null);
    const [code, setCode] = useState(challenge.starterCode);
    const [revealedHints, setRevealedHints] = useState<Set<number>>(new Set());
    const [isMounted, setIsMounted] = useState(false);
    const [selectedContrastTarget, setSelectedContrastTarget] = useState<ContrastColorTargetKey>("title");

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) {
            return undefined;
        }

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
    }, [challenge.starterCode, isMounted]);

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
    const resolvedIssues = useMemo(() => evaluateChallengeIssues(challenge, code), [challenge, code]);
    const activeErrors = useMemo(
        () => challenge.errors.filter((_, index) => !resolvedIssues[index]),
        [challenge.errors, resolvedIssues]
    );
    const contrastMetrics = useMemo(() => {
        if (challenge.type !== "contrast") {
            return null;
        }

        return getContrastMetrics(code);
    }, [challenge.type, code]);
    const contrastColorTargets = useMemo(() => {
        if (challenge.type !== "contrast") {
            return null;
        }

        return getContrastColorTargets(code);
    }, [challenge.type, code]);
    const screenReaderSimulation = useMemo(() => {
        if (challenge.type !== "screen-reader") {
            return null;
        }

        return extractScreenReaderSimulation(code, challenge);
    }, [challenge, code]);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const data = event.data as { type?: string; slug?: string } | null;

            if (!data || data.type !== "challenge-target-triggered") {
                return;
            }

            if (data.slug !== challenge.slug) {
                return;
            }

            router.push("/app/success");
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [challenge.slug, router]);

    if (!isMounted) {
        return (
            <div className="challenge-runner">
                <div className="challenge-runner__header">
                    <Text as="h1" fontSize="2xl">Challenge {challenge.id}: {challenge.title}</Text>
                    <IconButton aria-label="Challenge information" rounded="full" background="transparent">
                        <FiInfo className="h-5 w-5" />
                    </IconButton>
                </div>
                <div className="challenge-runner__content">
                    <Text color="var(--color-lavender-300)">Loading challenge preview...</Text>
                </div>
            </div>
        );
    }

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

    const handleContrastColorChange = (nextColor: string) => {
        setCode((currentCode) => setContrastColorTargetValue(currentCode, selectedContrastTarget, nextColor));
    };

    const selectedContrastColor =
        contrastColorTargets?.[selectedContrastTarget] ?? "#000000";

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
                    <div className={challenge.type === "contrast" ? "challenge-runner__editor-container challenge-runner__editor-container--contrast" : "challenge-runner__editor-container"}>
                        <div ref={editorHostRef} className="challenge-runner__editor-host" />
                        {challenge.type === "contrast" ? (
                            <div className="challenge-runner__contrast-tools">
                                <div className="challenge-runner__contrast-tools-header">
                                    <div>
                                        <div className="challenge-runner__contrast-tools-title">Color wheel</div>
                                        <div className="challenge-runner__contrast-tools-description">
                                            Pick a target, then adjust the hex value live in the editor.
                                        </div>
                                    </div>
                                
                                </div>

                                <div className="challenge-runner__contrast-targets">
                                    {contrastTargetOptions.map((target) => (
                                        <button
                                            key={target.key}
                                            type="button"
                                            className={selectedContrastTarget === target.key ? "challenge-runner__contrast-target challenge-runner__contrast-target--active" : "challenge-runner__contrast-target"}
                                            onClick={() => setSelectedContrastTarget(target.key)}
                                        >
                                            {target.label}
                                        </button>
                                    ))}
                                </div>

                                <label className="challenge-runner__contrast-picker-label">
                                    <span className="challenge-runner__contrast-picker-title">Hex color picker</span>
                                    <input
                                        type="color"
                                        value={selectedContrastColor}
                                        onChange={(event) => handleContrastColorChange(event.target.value)}
                                        className="challenge-runner__contrast-picker"
                                    />
                                </label>
                            </div>
                        ) : null}
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
                        <div className="challenge-runner__preview-container challenge-runner__preview-container--screen-reader">
                            <div className="challenge-runner__simulated-output challenge-runner__simulated-output--transcript" aria-live="polite">
                                <div className="challenge-runner__simulated-title">Simulated Screen Reader Output</div>
                                {screenReaderSimulation.headingLines.map((line) => (
                                    <div key={line} className="challenge-runner__simulated-line">{line}</div>
                                ))}
                                {screenReaderSimulation.inputLines.map((line) => (
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
                            {contrastMetrics ? (
                                <div style={{ display: "flex", gap: "8px", padding: "8px 10px", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)" }}>
                                    <div className="challenge-runner__hint-item" style={{ margin: 0, padding: "6px 10px" }}>
                                        Title: {contrastMetrics.title ? `${contrastMetrics.title.toFixed(2)}:1` : "n/a"}
                                    </div>
                                    <div className="challenge-runner__hint-item" style={{ margin: 0, padding: "6px 10px" }}>
                                        Body: {contrastMetrics.body ? `${contrastMetrics.body.toFixed(2)}:1` : "n/a"}
                                    </div>
                                    <div className="challenge-runner__hint-item" style={{ margin: 0, padding: "6px 10px" }}>
                                        Button: {contrastMetrics.button ? `${contrastMetrics.button.toFixed(2)}:1` : "n/a"}
                                    </div>
                                </div>
                            ) : null}
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
                        {activeErrors.length === 0 ? (
                            <div className="challenge-runner__hint-item">All current issues resolved.</div>
                        ) : activeErrors.map((error) => (
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
