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

function getPreviewDoc(challenge: ChallengeDefinition, code: string) {
    if (challenge.type === "keyboard-navigation") {
        return code.replace(
                        "</head>",
                        `<style>
                                body,
                                body * {
                                    pointer-events: none !important;
                                }

                :focus-visible {
                    outline: 3px solid #7c3aed;
                    outline-offset: 4px;
                }
            </style>
                        <script>
                            (function () {
                                const target = document.getElementById("target");
                                if (!target) {
                                    return;
                                }

                                const notifyParent = function () {
                                    window.parent.postMessage({ type: "challenge-target-triggered", slug: "keyboard-navigation" }, "*");
                                };

                                target.addEventListener("click", function (event) {
                                    event.preventDefault();
                                    notifyParent();
                                });
                            })();
                        </script>
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
        body * {
                    filter: blur(1.5px) saturate(0.9) brightness(0.95);
        }

                #sample-title,
                #sample-body,
                #sample-button {
                    outline: 2px dashed rgba(76, 29, 149, 0.35);
                    outline-offset: 4px;
                }

        body {
          overflow: hidden;
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

function parseHexColor(value: string) {
    const clean = value.trim().replace("#", "");

    if (clean.length === 3) {
        return clean.split("").map((ch) => Number.parseInt(ch + ch, 16));
    }

    if (clean.length === 6) {
        return [
            Number.parseInt(clean.slice(0, 2), 16),
            Number.parseInt(clean.slice(2, 4), 16),
            Number.parseInt(clean.slice(4, 6), 16),
        ];
    }

    return null;
}

function parseCssColor(value: string) {
    const normalized = value.trim().toLowerCase();

    if (normalized.startsWith("#")) {
        return parseHexColor(normalized);
    }

    const rgbMatch = normalized.match(/rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (rgbMatch) {
        return [
            Number.parseInt(rgbMatch[1], 10),
            Number.parseInt(rgbMatch[2], 10),
            Number.parseInt(rgbMatch[3], 10),
        ];
    }

    return null;
}

function extractCssText(code: string) {
    const matches = code.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi);
    return Array.from(matches, (match) => match[1] ?? "").join("\n");
}

function getRuleDeclarations(cssText: string, selector: string) {
    const declarations: Record<string, string> = {};
    const blockRegex = /([^{}]+)\{([^{}]+)\}/g;
    let blockMatch = blockRegex.exec(cssText);

    while (blockMatch) {
        const selectors = blockMatch[1].split(",").map((item) => item.trim());
        if (selectors.includes(selector)) {
            const rules = blockMatch[2].split(";");
            for (const rule of rules) {
                const [rawKey, rawValue] = rule.split(":");
                const key = rawKey?.trim().toLowerCase();
                const value = rawValue?.trim();

                if (key && value) {
                    declarations[key] = value;
                }
            }
        }

        blockMatch = blockRegex.exec(cssText);
    }

    return declarations;
}

function resolveColorFromCss(cssText: string, selectors: string[], properties: string[]) {
    for (const selector of selectors) {
        const declarations = getRuleDeclarations(cssText, selector);
        for (const property of properties) {
            const value = declarations[property.toLowerCase()];
            const parsed = value ? parseCssColor(value) : null;
            if (parsed) {
                return parsed;
            }
        }
    }

    return null;
}

function getContrastMetrics(code: string) {
    const doc = parseHtmlDocument(code);
    if (!doc) {
        return null;
    }

    const cssText = extractCssText(code);
    const bodyElement = doc.body;
    const title = doc.querySelector("#sample-title") as HTMLElement | null;
    const bodyText = doc.querySelector("#sample-body") as HTMLElement | null;
    const button = doc.querySelector("#sample-button") as HTMLElement | null;

    const bodyBg =
        resolveColorFromCss(cssText, ["body"], ["background", "background-color"]) ||
        parseCssColor(bodyElement?.style.background || bodyElement?.style.backgroundColor || "");
    const titleFg =
        resolveColorFromCss(cssText, ["#sample-title", ".sample-title", "h1"], ["color"]) ||
        parseCssColor(title?.style.color || "") ||
        resolveColorFromCss(cssText, ["body"], ["color"]);
    const bodyTextFg =
        resolveColorFromCss(cssText, ["#sample-body", ".sample-body", "p"], ["color"]) ||
        parseCssColor(bodyText?.style.color || "") ||
        resolveColorFromCss(cssText, ["body"], ["color"]);
    const buttonFg =
        resolveColorFromCss(cssText, ["#sample-button", ".sample-button", "button"], ["color"]) ||
        parseCssColor(button?.style.color || "");
    const buttonBg =
        resolveColorFromCss(cssText, ["#sample-button", ".sample-button", "button"], ["background", "background-color"]) ||
        parseCssColor(button?.style.background || button?.style.backgroundColor || "");

    return {
        title: titleFg && bodyBg ? contrastRatio(titleFg, bodyBg) : null,
        body: bodyTextFg && bodyBg ? contrastRatio(bodyTextFg, bodyBg) : null,
        button: buttonFg && buttonBg ? contrastRatio(buttonFg, buttonBg) : null,
    };
}

function luminance(rgb: number[]) {
    const channels = rgb.map((channel) => {
        const value = channel / 255;
        return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(foreground: number[], background: number[]) {
    const l1 = luminance(foreground);
    const l2 = luminance(background);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function parseHtmlDocument(code: string) {
    if (typeof document === "undefined") {
        return null;
    }

    const parsedDocument = document.implementation.createHTMLDocument("");
    parsedDocument.documentElement.innerHTML = code;
    return parsedDocument;
}

function getAccessibleInputName(input: HTMLInputElement, doc: Document) {
    const ariaLabel = input.getAttribute("aria-label")?.trim();
    if (ariaLabel) {
        return ariaLabel;
    }

    const labelledBy = input.getAttribute("aria-labelledby")?.trim();
    if (labelledBy) {
        return labelledBy
            .split(/\s+/)
            .map((id) => doc.getElementById(id)?.textContent?.trim() ?? "")
            .join(" ")
            .trim();
    }

    if (!input.id) {
        return "";
    }

    const label = doc.querySelector(`label[for="${input.id}"]`);
    return label?.textContent?.trim() ?? "";
}

function evaluateChallengeIssues(challenge: ChallengeDefinition, code: string) {
    const doc = parseHtmlDocument(code);

    if (!doc) {
        return challenge.errors.map(() => false);
    }

    if (challenge.type === "keyboard-navigation") {
        const target = doc.getElementById("target");
        const targetTabindex = target?.getAttribute("tabindex");
        const targetIsInteractive = target ? ["a", "button"].includes(target.tagName.toLowerCase()) : false;
        const targetReachable = Boolean(targetIsInteractive && targetTabindex !== "-1");

        const nonInteractiveControl = Boolean(
            doc.querySelector("div[role='button'], div[role='link'], span[role='button'], span[role='link'], div[onclick], span[onclick]")
        );

        const positiveTabindex = Array.from(doc.querySelectorAll("[tabindex]"))
            .some((element) => {
                const raw = element.getAttribute("tabindex");
                if (!raw) {
                    return false;
                }
                const parsed = Number.parseInt(raw, 10);
                return Number.isFinite(parsed) && parsed > 0;
            });

        const hasTabTrap = Array.from(doc.querySelectorAll("[onkeydown], [onkeypress], [onkeyup]"))
            .some((element) => {
                const handler =
                    element.getAttribute("onkeydown") ||
                    element.getAttribute("onkeypress") ||
                    element.getAttribute("onkeyup") ||
                    "";

                return /Tab/i.test(handler) && /preventDefault\s*\(/i.test(handler);
            });

        return [targetReachable, !nonInteractiveControl, !positiveTabindex, !hasTabTrap];
    }

    if (challenge.type === "screen-reader") {
        const inputs = Array.from(doc.querySelectorAll("input:not([type='hidden'])"));
        const button = doc.querySelector("button");
        const statusRegion = doc.querySelector(".status");

        const allInputsHaveAssociations = inputs.every((input) => {
            const hasLabelFor = Boolean(input.id && doc.querySelector(`label[for="${input.id}"]`));
            const hasAriaLabel = Boolean(input.getAttribute("aria-label")?.trim());
            const hasLabelledBy = Boolean(input.getAttribute("aria-labelledby")?.trim());
            return hasLabelFor || hasAriaLabel || hasLabelledBy;
        });

        const buttonHasGoodName = Boolean(button && stripTags(button.textContent || "").trim().toLowerCase() !== "click here");
        const liveValue = statusRegion?.getAttribute("aria-live")?.trim().toLowerCase();
        const roleValue = statusRegion?.getAttribute("role")?.trim().toLowerCase();
        const statusHasLiveRegion = Boolean(
            statusRegion && (
                roleValue === "alarm" ||
                liveValue === "polite" ||
                liveValue === "assertive"
            )
        );

        return [allInputsHaveAssociations, buttonHasGoodName, statusHasLiveRegion];
    }

    const metrics = getContrastMetrics(code);
    const titleContrastPass = Boolean(metrics?.title && metrics.title >= 4.5);
    const bodyContrastPass = Boolean(metrics?.body && metrics.body >= 4.5);
    const buttonContrastPass = Boolean(metrics?.button && metrics.button >= 4.5);

    return [titleContrastPass, bodyContrastPass, buttonContrastPass];
}

function extractScreenReaderSimulation(code: string, challenge: ChallengeDefinition) {
    const headingLines: string[] = [];
    const inputLines: string[] = [];
    const buttonLines: string[] = [];
    const warnings: string[] = [];
    const doc = parseHtmlDocument(code);

    if (!doc) {
        return {
            headingLines,
            inputLines: ["No text inputs found."],
            buttonLines: ["No buttons found."],
            liveText: "No status region found.",
            warnings,
            introTitle: challenge.previewTitle,
            introDescription: challenge.previewDescription,
        };
    }

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

    const inputs = Array.from(doc.querySelectorAll<HTMLInputElement>(
        'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="image"])'
    ));
    for (const [index, input] of inputs.entries()) {
        const accessibleName = getAccessibleInputName(input, doc).trim();
        const fieldType = (input.getAttribute("type") || "text").toLowerCase();
        const announcementLabel = fieldType === "email" ? "Email field" : fieldType === "password" ? "Password field" : "Text field";
        const fieldPrefix = `${announcementLabel} ${index + 1}`;

        if (accessibleName.length > 0) {
            inputLines.push(`${fieldPrefix}: ${accessibleName}`);
        } else {
            inputLines.push(`${fieldPrefix}: unlabeled`);
            warnings.push("At least one text input has no accessible label.");
        }
    }

    if (inputs.length === 0) {
        inputLines.push("No text inputs found.");
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

    const liveMatch = doc.querySelector("[aria-live]");
    const statusRegion = doc.querySelector(".status") ?? liveMatch;
    const liveText = statusRegion ? stripTags(statusRegion.textContent || "") : "No status region found.";

    if (!liveMatch) {
        warnings.push("No aria-live region found for status updates.");
    }

    return {
        headingLines,
        inputLines,
        buttonLines,
        liveText,
        warnings: [],
        introTitle: challenge.previewTitle,
        introDescription: challenge.previewDescription,
    };
}

export default function ChallengeRunner({ challenge }: ChallengeRunnerProps) {
    const router = useRouter();
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
    const resolvedIssues = useMemo(() => evaluateChallengeIssues(challenge, code), [challenge, code]);
    const activeErrors = useMemo(
        () => challenge.errors.filter((_, index) => !resolvedIssues[index]),
        [challenge.errors, resolvedIssues]
    );
    const resolvedCount = useMemo(
        () => challenge.errors.length - activeErrors.length,
        [challenge.errors.length, activeErrors.length]
    );
    const hintsUsed = revealedHints.size;
    const contrastMetrics = useMemo(() => {
        if (challenge.type !== "contrast") {
            return null;
        }

        return getContrastMetrics(code);
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