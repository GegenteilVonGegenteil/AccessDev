import type { Challenge } from "@/consts/structures";

/*
    function that puts the code in the editor into a seperarate document
    this documents exists offscreen
    this creates a safe enviroment to analyze and parse the code, without affecting the main document
*/
export function parseHtmlDocument(code: string): Document | null {
    if (typeof document === "undefined") {
        return null;
    }
    const parsedDocument = document.implementation.createHTMLDocument("");
    parsedDocument.documentElement.innerHTML = code;
    return parsedDocument;
}

// function to make the code easier to read/check by removing all html tags and removing extra whitespace
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

//#region Color Contrast Challenge Utilities

// convert hex color into RGB channels for calculation later
export function parseHexColor(value: string): number[] | null {
    // remove the # and trim whitespace
    const clean = value.trim().replace("#", "");

    // expand shorthand hex into full hex notation (#abc -> aabbcc)
    if (clean.length === 3) {
        return clean.split("").map((ch) => Number.parseInt(ch + ch, 16));
    }

    // full hex notation turned into RGB channels (#aabbcc -> [aa, bb, cc])
    if (clean.length === 6) {
        return [
            Number.parseInt(clean.slice(0, 2), 16),
            Number.parseInt(clean.slice(2, 4), 16),
            Number.parseInt(clean.slice(4, 6), 16),
        ];
    }

    return null;
}

// parses CSS color values into RGB channel values
export function parseCssColor(value: string): number[] | null {
    // nomrailze values by removing whitespace and converting to lower case
    const normalized = value.trim().toLowerCase();

    // check if the value is a hex color, and if so, parse it
    if (normalized.startsWith("#")) {
        return parseHexColor(normalized);
    }

    // if its RGB or RGBA, return the channels as numbers
    // matches rgb or rgba
    const rgbMatch = normalized.match(/rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    // return the channels as numbers in an array, ignores alpha if present
    if (rgbMatch) {
        return [
            Number.parseInt(rgbMatch[1], 10),
            Number.parseInt(rgbMatch[2], 10),
            Number.parseInt(rgbMatch[3], 10),
        ];
    }

    return null;
}

// extract all CSS inside of the <style> tags of the code, returning them as a single string
export function extractCssText(code: string): string {
    const matches = code.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi);
    return Array.from(matches, (match) => match[1] ?? "").join("\n");
}

// get the CSS declaration for a selector returning the key/value pairs as an object
export function getRuleDeclarations(cssText: string, selector: string): Record<string, string> {
    const declarations: Record<string, string> = {};
    // regex matching a CSS block, getting the selectors and declerations
    const blockRegex = /([^{}]+)\{([^{}]+)\}/g;
    let blockMatch = blockRegex.exec(cssText);

    // loop through all the blocks in the CSS text
    while (blockMatch) {
        // split the selectors by comma and trim whitespace, then check if the selector is in the list
        const selectors = blockMatch[1].split(",").map((item) => item.trim());
        if (selectors.includes(selector)) {
            // parse the declerations into key/value pairs adn add them into the decleration object
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
        // get the next block in the CSS text
        blockMatch = blockRegex.exec(cssText);
    }
    return declarations;
}

// try selectors to get the colour values of an element
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

/*
    function to calculate the luminance of a color
    uses the RGB channels calculated earlier
    uses the WCAF formula for luminance
    0 is the darkest, 1 is the brightest
*/
export function luminance(rgb: number[]): number {
    /* 
        each channel is normalized to a vlalue between 0 and 1 by deviding it by 255 (the max value)
        the rest is the WCAG formula for relative luminance
    */
    const channels = rgb.map((channel) => {
        const value = channel / 255;
        return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

/*
    function to calulate the color contrast ratio between two colors
    uses the liminance function above to get the individual luminances of the colors
    then uses the WCAG formula for contrast ratio
*/
export function contrastRatio(foreground: number[], background: number[]): number {
    const l1 = luminance(foreground);
    const l2 = luminance(background);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

// function to get the contrast ratios of the target elements in the contrast challenge
export function getContrastMetrics(code: string): {
    title: number | null;
    body: number | null;
    button: number | null;
} | null {
    const doc = parseHtmlDocument(code);
    if (!doc) {
        return null;
    }

    // get the CSS from the code
    const cssText = extractCssText(code);
    // get all the relevant elements from the document
    const bodyElement = doc.body;
    const title = doc.querySelector("#sample-title") as HTMLElement | null;
    const bodyText = doc.querySelector("#sample-body") as HTMLElement | null;
    const button = doc.querySelector("#sample-button") as HTMLElement | null;

    // check the CSS for the background and foreground colors of the elements, falling back to inline styles if not found
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

    // get all the contrast ratios for the elements
    return {
        title: titleFg && bodyBg ? contrastRatio(titleFg, bodyBg) : null,
        body: bodyTextFg && bodyBg ? contrastRatio(bodyTextFg, bodyBg) : null,
        button: buttonFg && buttonBg ? contrastRatio(buttonFg, buttonBg) : null,
    };
}

// types of targets in the contrast challenge
export type ContrastColorTargetKey = "title" | "body" | "buttonText" | "buttonBackground";

// the targets with their corresponding color values
export type ContrastColorTargets = Record<ContrastColorTargetKey, string | null>;

// convert RGB back to hex to be displayed
function rgbToHex(rgb: number[]) {
    return `#${rgb.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

// get the current color values for all targets
export function getContrastColorTargets(code: string): ContrastColorTargets {
    const cssText = extractCssText(code);

    const titleRgb = resolveColorFromCss(cssText, [".sample-title"], ["color"]);
    const bodyRgb = resolveColorFromCss(cssText, [".sample-body"], ["color"]);
    const buttonTextRgb = resolveColorFromCss(cssText, [".sample-button"], ["color"]);
    const buttonBackgroundRgb = resolveColorFromCss(cssText, [".sample-button"], ["background", "background-color"]);

    return {
        title: titleRgb ? rgbToHex(titleRgb) : null,
        body: bodyRgb ? rgbToHex(bodyRgb) : null,
        buttonText: buttonTextRgb ? rgbToHex(buttonTextRgb) : null,
        buttonBackground: buttonBackgroundRgb ? rgbToHex(buttonBackgroundRgb) : null,
    };
}

// escape a string ensuring it can be used in the regex without breaking the pattern
function escapeRegExp(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// replace a CSS property value for a given selector in the CSS text
function replaceCssPropertyValue(cssText: string, selector: string, property: string, newValue: string) {
    const selectorPattern = escapeRegExp(selector);
    const propertyPattern = escapeRegExp(property);
    const blockPattern = new RegExp(`(${selectorPattern}\\s*\\{[\\s\\S]*?${propertyPattern}\\s*:\\s*)([^;]+)(;?)`, "i");
    return cssText.replace(blockPattern, `$1${newValue}$3`);
}

// function to set a new color value for a target in the contrast challenge
export function setContrastColorTargetValue(code: string, target: ContrastColorTargetKey, newValue: string) {
    // find the <style> block
    const styleMatch = /(<style[^>]*>)([\s\S]*?)(<\/style>)/i.exec(code);

    if (!styleMatch) {
        return code;
    }

    // map the target to the corresponding selector and property to change
    const selectorsByTarget: Record<ContrastColorTargetKey, { selector: string; property: string }> = {
        title: { selector: ".sample-title", property: "color" },
        body: { selector: ".sample-body", property: "color" },
        buttonText: { selector: ".sample-button", property: "color" },
        buttonBackground: { selector: ".sample-button", property: "background" },
    };

    // get the selector and property for the target, then replace the value in the CSS text
    const { selector, property } = selectorsByTarget[target];
    const nextCssText = replaceCssPropertyValue(styleMatch[2] ?? "", selector, property, newValue);

    // return the code with the updated <style> block
    return code.replace(styleMatch[2] ?? "", nextCssText);
}

export function evaluateContrastRatios(code: string): boolean[] {
    const metrics = getContrastMetrics(code);

    const titleContrastPass = Boolean(metrics?.title && metrics.title >= 4.5);
    const bodyContrastPass = Boolean(metrics?.body && metrics.body >= 4.5);
    const buttonContrastPass = Boolean(metrics?.button && metrics.button >= 4.5);

    return [titleContrastPass, bodyContrastPass, buttonContrastPass];
}

//#endregion

//#region Keyboard Navigation Challenge Utilities

// checks for the errors in the keyboard navigation challenge, returning a bool for each
export function evaluateKeyboardNavigation(doc: Document): boolean[] {
    // check if element has a negative tabindex
    const negativeTabindex = Array.from(doc.querySelectorAll("[tabindex]"))
        .some((element) => {
            const raw = element.getAttribute("tabindex");
            if (!raw) {
                return false;
            }
            const parsed = Number.parseInt(raw, 10);
            return Number.isFinite(parsed) && parsed < 0;
        });

    // check if non-interactive elements have click handlers
    const nonInteractiveControl = Boolean(
        doc.querySelector(" div[onclick], span[onclick]")
    );

    // check if an element has a positive tabindex
    const positiveTabindex = Array.from(doc.querySelectorAll("[tabindex]"))
        .some((element) => {
            const raw = element.getAttribute("tabindex");
            if (!raw) {
                return false;
            }
            const parsed = Number.parseInt(raw, 10);
            return Number.isFinite(parsed) && parsed > 0;
        });

    // check for keyboard trap
    const hasTabTrap = Array.from(doc.querySelectorAll("[onkeydown], [onkeypress], [onkeyup]"))
        .some((element) => {
            const handler =
                element.getAttribute("onkeydown") ||
                element.getAttribute("onkeypress") ||
                element.getAttribute("onkeyup") ||
                "";

            // ensure its keyboard trap by having a tab handler and prevening default
            return /Tab/i.test(handler) && /preventDefault\s*\(/i.test(handler);
        });

    // return the boolean for each rule
    return [!negativeTabindex, !nonInteractiveControl, !positiveTabindex, !hasTabTrap];
}

//#endregion

//#region Screen Reader Challenge Utilities

// function to get the accessible name of an input element
export function getAccessibleInputName(input: HTMLInputElement, doc: Document): string {
    // check for aria label first and return if found
    const ariaLabel = input.getAttribute("aria-label")?.trim();
    if (ariaLabel) {
        return ariaLabel;
    }

    // check for labelledby next and return text content if found
    const labelledBy = input.getAttribute("aria-labelledby")?.trim();
    if (labelledBy) {
        return labelledBy
            .split(/\s+/)
            .map((id) => doc.getElementById(id)?.textContent?.trim() ?? "")
            .join(" ")
            .trim();
    }

    // check if an associated label exists and return its text content
    if (!input.id) {
        return "";
    }
    const label = doc.querySelector(`label[for="${input.id}"]`);
    return label?.textContent?.trim() ?? "";
}

// check for the screen reader challenge errors
export function evaluateScreenReader(doc: Document): boolean[] {

    // get all inputs, the button and status region for the checks
    const inputs = Array.from(doc.querySelectorAll("input"));
    const button = doc.querySelector("button");
    const statusRegion = doc.querySelector(".status");

    //check if the inputs have an accessible name
    const allInputsHaveAssociations = inputs.every((input) => {
        return getAccessibleInputName(input, doc).length > 0;
    });

    // check if the button name has been changed from the default
    const buttonHasGoodName = Boolean(button && stripTags(button.textContent || "").trim().toLowerCase() !== "click here");

    // check if the live region has an aria-live or role="alert" attribute
    const hasLiveRegion = Boolean(statusRegion?.getAttribute("aria-live") || statusRegion?.getAttribute("role") === "alert" || statusRegion?.getAttribute("role") === "status");

    // return all bools
    return [allInputsHaveAssociations, buttonHasGoodName, hasLiveRegion];
}


// gets the relevant data for the screen reader simulation, including headings, inputs, buttons, and live region text
export function extractScreenReaderSimulation(code: string, challenge: Challenge) {
    const headingLines: string[] = [];
    const inputLines: string[] = [];
    const buttonLines: string[] = [];
    const warnings: string[] = [];
    const doc = parseHtmlDocument(code);

    if (!doc) {
        return null;
    }

    // get the headings in the code
    const headingRegex = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi;
    let headingMatch = headingRegex.exec(code);

    // loop through all headings and record their levels and texts
    while (headingMatch) {
        const level = Number.parseInt(headingMatch[1], 10);
        const text = stripTags(headingMatch[2]);

        if (text.length > 0) {
            headingLines.push(`Heading level ${level}: ${text}`);
        }

        headingMatch = headingRegex.exec(code);
    }

    // get all the inputs and report their accessible names
    const inputs = Array.from(doc.querySelectorAll<HTMLInputElement>(
        'input'
    ));
    // loop through all inputs and report their accessible names
    for (const [index, input] of inputs.entries()) {
        const accessibleName = getAccessibleInputName(input, doc).trim();
        const fieldType = (input.getAttribute("type") || "text").toLowerCase();
        const announcementLabel = fieldType === "email" ? "Email field" : fieldType === "password" ? "Password field" : "Text field";
        const fieldPrefix = `${announcementLabel} ${index + 1}`;

        if (accessibleName.length > 0) {
            inputLines.push(`${fieldPrefix}: ${accessibleName}`);
        } else {
            inputLines.push(`${fieldPrefix}: edit text`);
        }
    }

    // gett all buttons and report their accessible names
    const buttonRegex = /<button([^>]*)>([\s\S]*?)<\/button>/gi;
    let buttonMatch = buttonRegex.exec(code);

    while (buttonMatch) {
        const attributes = buttonMatch[1] ?? "";
        const content = buttonMatch[2] ?? "";
        const ariaLabelMatch = /aria-label\s*=\s*(["'])(.*?)\1/i.exec(attributes);
        const accessibleName = (ariaLabelMatch?.[2] ?? stripTags(content)).trim();

        if (accessibleName.length > 0) {
            buttonLines.push(`Button: ${accessibleName}`);
        }

        buttonMatch = buttonRegex.exec(code);
    }

    // check for status relevant attribbutes
    const liveMatch = doc.querySelector("[aria-live]");
    const statusRegion = doc.querySelector(".status") ?? liveMatch;
    const liveText = statusRegion ? stripTags(statusRegion.textContent || "") : "No status region found.";

    // return the simulation data for the screen reader challenge
    return {
        headingLines,
        inputLines,
        buttonLines,
        liveText,
        warnings,
    };
}

//#endregion

// evaluates the code based on the current challenge
export function evaluateChallengeIssues(challenge: Challenge, code: string): boolean[] {
    // parse the code into a doc for analysis
    const doc = parseHtmlDocument(code);

    if (!doc) {
        return challenge.errors.map(() => false);
    }

    // run validation depending on the challenge type
    if (challenge.type === "keyboard-navigation") {
        return evaluateKeyboardNavigation(doc);
    }

    if (challenge.type === "screen-reader") {
        return evaluateScreenReader(doc);
    }

    // contrast challenge used as default
    return evaluateContrastRatios(code);
}

// builds the iframe preview code, with any necessary modifications for the challenge type
// notebaly, the screen reader challenge does not use any additional modification, as the simulation doesn't use an iframe
export function getPreviewDoc(challenge: Challenge, code: string): string {
    // keyboard navigation get a focus ring, click events should be prevented, but somehow this randomly decides not to work sometimes
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
        target.addEventListener("click", function (event) {
            event.preventDefault();
            notifyParent();
        });
    })();
</script>
</head>`
        );
    }

    // screen reader gets returned as is
    if (challenge.type === "screen-reader") {
        return code;
    }

    // contrast challenge gets a blur filter
    if (challenge.type === "contrast") {
        return code.replace(
            "</head>",
            `<style>
    body * {
        filter: blur(1.5px) saturate(0.9) brightness(0.95);
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
