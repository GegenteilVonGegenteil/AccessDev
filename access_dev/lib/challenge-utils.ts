/**
 * Utility functions for challenge validation and HTML/CSS parsing.
 * Extracted from challenge-runner.tsx to reduce component complexity.
 */

import type { ChallengeDefinition } from "@/consts/challenges";

// ============================================================================
// HTML Parsing & DOM Utilities
// ============================================================================

export function parseHtmlDocument(code: string): Document | null {
    if (typeof document === "undefined") {
        return null;
    }

    const parsedDocument = document.implementation.createHTMLDocument("");
    parsedDocument.documentElement.innerHTML = code;
    return parsedDocument;
}

export function stripTags(value: string): string {
    return value
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/\s+/g, " ")
        .trim();
}

// ============================================================================
// Color Parsing Utilities
// ============================================================================

export function parseHexColor(value: string): number[] | null {
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

export function parseCssColor(value: string): number[] | null {
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

// ============================================================================
// CSS Parsing & Rule Extraction
// ============================================================================

export function extractCssText(code: string): string {
    const matches = code.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi);
    return Array.from(matches, (match) => match[1] ?? "").join("\n");
}

export function getRuleDeclarations(cssText: string, selector: string): Record<string, string> {
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

export function resolveColorFromCss(
    cssText: string,
    selectors: string[],
    properties: string[]
): number[] | null {
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

// ============================================================================
// Contrast Calculation
// ============================================================================

export function luminance(rgb: number[]): number {
    const channels = rgb.map((channel) => {
        const value = channel / 255;
        return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

export function contrastRatio(foreground: number[], background: number[]): number {
    const l1 = luminance(foreground);
    const l2 = luminance(background);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

export function getContrastMetrics(code: string): {
    title: number | null;
    body: number | null;
    button: number | null;
} | null {
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

export type ContrastColorTargetKey = "title" | "body" | "buttonText" | "buttonBackground";

export type ContrastColorTargets = Record<ContrastColorTargetKey, string | null>;

function rgbToHex(rgb: number[]) {
    return `#${rgb.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

export function getContrastColorTargets(code: string): ContrastColorTargets {
    const cssText = extractCssText(code);

    const titleRgb = resolveColorFromCss(cssText, ["#sample-title", ".sample-title", "h1"], ["color"]);
    const bodyRgb = resolveColorFromCss(cssText, ["#sample-body", ".sample-body", "p"], ["color"]);
    const buttonTextRgb = resolveColorFromCss(cssText, ["#sample-button", ".sample-button", "button"], ["color"]);
    const buttonBackgroundRgb = resolveColorFromCss(cssText, ["#sample-button", ".sample-button", "button"], ["background", "background-color"]);

    return {
        title: titleRgb ? rgbToHex(titleRgb) : null,
        body: bodyRgb ? rgbToHex(bodyRgb) : null,
        buttonText: buttonTextRgb ? rgbToHex(buttonTextRgb) : null,
        buttonBackground: buttonBackgroundRgb ? rgbToHex(buttonBackgroundRgb) : null,
    };
}

function escapeRegExp(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceCssPropertyValue(cssText: string, selector: string, property: string, newValue: string) {
    const selectorPattern = escapeRegExp(selector);
    const propertyPattern = escapeRegExp(property);
    const blockPattern = new RegExp(`(${selectorPattern}\\s*\\{[\\s\\S]*?${propertyPattern}\\s*:\\s*)([^;]+)(;?)`, "i");
    return cssText.replace(blockPattern, `$1${newValue}$3`);
}

export function setContrastColorTargetValue(code: string, target: ContrastColorTargetKey, newValue: string) {
    const styleMatch = /(<style[^>]*>)([\s\S]*?)(<\/style>)/i.exec(code);

    if (!styleMatch) {
        return code;
    }

    const selectorsByTarget: Record<ContrastColorTargetKey, { selector: string; property: string }> = {
        title: { selector: ".sample-title", property: "color" },
        body: { selector: ".sample-body", property: "color" },
        buttonText: { selector: ".sample-button", property: "color" },
        buttonBackground: { selector: ".sample-button", property: "background" },
    };

    const { selector, property } = selectorsByTarget[target];
    const nextCssText = replaceCssPropertyValue(styleMatch[2] ?? "", selector, property, newValue);

    return code.replace(styleMatch[2] ?? "", nextCssText);
}

// ============================================================================
// Challenge-Specific Validation
// ============================================================================

export function evaluateKeyboardNavigation(doc: Document): boolean[] {
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

export function getAccessibleInputName(input: HTMLInputElement, doc: Document): string {
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

export function evaluateScreenReader(doc: Document): boolean[] {
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

export function evaluateChallengeIssues(challenge: ChallengeDefinition, code: string): boolean[] {
    const doc = parseHtmlDocument(code);

    if (!doc) {
        return challenge.errors.map(() => false);
    }

    if (challenge.type === "keyboard-navigation") {
        return evaluateKeyboardNavigation(doc);
    }

    if (challenge.type === "screen-reader") {
        return evaluateScreenReader(doc);
    }

    const metrics = getContrastMetrics(code);
    const titleContrastPass = Boolean(metrics?.title && metrics.title >= 4.5);
    const bodyContrastPass = Boolean(metrics?.body && metrics.body >= 4.5);
    const buttonContrastPass = Boolean(metrics?.button && metrics.button >= 4.5);

    return [titleContrastPass, bodyContrastPass, buttonContrastPass];
}

// ============================================================================
// Screen Reader Simulation
// ============================================================================

export function extractScreenReaderSimulation(code: string, challenge: ChallengeDefinition) {
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

// ============================================================================
// Preview Document Generation
// ============================================================================

export function getPreviewDoc(challenge: ChallengeDefinition, code: string): string {
    if (challenge.type === "keyboard-navigation") {
        return code.replace(
            "</head>",
            `<style>
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
