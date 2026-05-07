export type ChallengeType = "keyboard-navigation" | "screen-reader" | "contrast";

export type ChallengeDefinition = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  type: ChallengeType;
  objective: string;
  starterCode: string;
  previewTitle: string;
  previewDescription: string;
  errors: string[];
  hints: string[];
  validation?: string;
};

export const challenges: ChallengeDefinition[] = [
  {
    id: 1,
    slug: "keyboard-navigation",
    title: "Keyboard Navigation",
    subtitle: "Keyboard accessibility (tab order, focusable controls)",
    type: "keyboard-navigation",
    objective: "Make the target link reachable with exactly two Tab presses from the start of the page and ensure it is a proper interactive element.",
    starterCode: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Button Demo</title>
    <style>
      :root {
        color-scheme: light;
        font-family: Inter, Arial, sans-serif;
      }

      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: #ece5f8;
        color: #17101f;
      }

      .container {
        display: grid;
        gap: 12px;
        justify-items: center;
      }

      .clickable {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 12px 20px;
        border-radius: 12px;
        border: 0;
        background: #8b5cf6;
        color: white;
        font: inherit;
      }
      nav a { margin-right: 12px }
    </style>
  </head>
  <body>
    <main class="container">
      <h2>Button Demo</h2>
      <p>Find and activate the target using exactly two Tab presses.</p>

      <div class="clickable" role="link" onclick="alert('div link')">Fake Link (div)</div>

      <button
        id="trap"
        class="clickable"
        onkeydown="if (event.key === 'Tab') { event.preventDefault(); this.focus(); }"
      >
        Keyboard Trap Button
      </button>

      <a id="target" href="/app/success" tabindex="-1" class="clickable">Go to Success</a>
    </main>
  </body>
</html>`,
    previewTitle: "Keyboard Navigation",
    previewDescription: "A navigation bar, content area, and a target action exist but the target is not reachable via keyboard by default. Fix focusability and order so two Tabs from the page start lands on the target.",
    errors: [
      "Target control has tabindex=\"-1\" and is skipped by Tab.",
      "Non-interactive elements are used as controls (no keyboard support).",
      "Incorrect tabindex values disrupt natural focus order.",
      "An element traps keyboard focus and blocks normal Tab navigation.",
    ],
    hints: [
      "Replace decorative divs with <button> or <a> when they perform actions.",
      "Remove or fix tabindex attributes that override natural order.",
      "Remove any key handlers that prevent Tab from moving focus forward.",
      "Ensure the DOM order matches logical/visual order so Tab works predictably.",
    ],
    validation: `// Simulate starting at document.body then pressing Tab twice
(function(){
  const start = document.body;
  start.focus?.();
  function pressTab() {
    const e = new KeyboardEvent('keydown', {key: 'Tab', bubbles: true});
    document.dispatchEvent(e);
  }
  // Many environments won't actually move focus via synthetic events; test heuristically:
  const els = Array.from(document.querySelectorAll('a, button, [tabindex]'))
    .filter(e => !e.hasAttribute('disabled') && e.getAttribute('tabindex') !== '-1');
  // Expect the target to be the second focusable control
  return els[1] && els[1].id === 'target';
})()`,
  },
  {
    id: 2,
    slug: "screen-reader",
    title: "Form Labels",
    subtitle: "Form labeling and accessible names for inputs",
    type: "screen-reader",
    objective: "Ensure each form field has a proper accessible name via a <label> or aria attributes so screen readers announce them correctly.",
    starterCode: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Announcement Demo</title>
    <style>
      :root {
        color-scheme: light;
        font-family: Inter, Arial, sans-serif;
      }

      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: #f5efff;
        color: #17101f;
      }

      .card {
        display: grid;
        gap: 12px;
        padding: 32px;
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.75);
      }

      .status {
        min-height: 1.5rem;
      }
    </style>
  </head>
  <body>
      <main class="card">
        <h1>Contact</h1>
        <p>Fill out the form below.</p>

        <form>
          <input id="first" type="text" placeholder="First name" />
          <input id="last" type="text" placeholder="Last name" />
          <input id="email" type="email" placeholder="Email" />
          <button type="submit">Submit</button>
        </form>

        <div class="status" aria-live="polite">Waiting for action...</div>
      </main>
  </body>
</html>`,
      previewTitle: "Form Labeling",
      previewDescription: "A simple form contains inputs without labels; assistive technology reads them as repeated 'Edit text'. Add labels or accessible names so each field is announced distinctly.",
      errors: [
        "Inputs lack associated <label> elements.",
        "No aria-label or aria-labelledby on fields.",
        "Form fields are announced ambiguously by screen readers.",
      ],
      hints: [
        "Add <label for=\"id\"> text and matching id attributes.",
        "Alternatively add aria-label or aria-labelledby for each input.",
        "Visible labels improve usability for all users.",
      ],
      validation: `const inputs = document.querySelectorAll('input');
  [...inputs].every(input => {
    const hasLabel = Boolean(
      input.getAttribute('aria-label') ||
      input.getAttribute('aria-labelledby') ||
      (input.id && document.querySelector('label[for="' + input.id + '"]'))
    );
    return hasLabel;
  })`,
  },
  {
    id: 3,
    slug: "contrast",
    title: "Color Contrast",
    subtitle: "Fix low contrast so text and controls meet WCAG thresholds",
    type: "contrast",
    objective: "Adjust colors so normal text meets a 4.5:1 contrast ratio (or 3:1 for large text).",
    starterCode: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Contrast Demo</title>
    <style>
      :root {
        color-scheme: light;
        font-family: Inter, Arial, sans-serif;
      }

      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: #f4eafe;
        color: #8c70a6;
      }

      .card {
        display: grid;
        gap: 16px;
        padding: 32px;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.6);
      }

      .cta {
        border: 0;
        padding: 12px 18px;
        border-radius: 999px;
        background: #b58df5;
        color: #f8f3ff;
      }
    </style>
  </head>
  <body>
    <section class="card">
      <h2>Contrast Demo</h2>
      <p class="small">Improve the contrast to make this easier to read.</p>
      <button class="cta" type="button">Continue</button>
    </section>
  </body>
</html>`,
    previewTitle: "Contrast Demo",
    previewDescription: "This preview uses low-contrast foregrounds. Increase contrast (color or background) until it meets WCAG thresholds.",
    errors: [
      "Normal body text fails the 4.5:1 contrast ratio.",
      "Button text contrast is too low against its background.",
      "Secondary text elements are difficult to perceive.",
    ],
    hints: [
      "Check computed styles for foreground and background colors.",
      "Aim for 4.5:1 for normal text, 3:1 for large text.",
      "Adjust lightness/saturation or change background to increase ratio.",
    ],
    validation: `// Example contrast check (consumer code should compute actual rgb values)
function luminance(r,g,b){
  const a=[r,g,b].map(v=>{
    v/=255; return v<=0.03928? v/12.92 : Math.pow((v+0.055)/1.055,2.4);
  });
  return 0.2126*a[0]+0.7152*a[1]+0.0722*a[2];
}
function contrastRatio(fgRGB, bgRGB){
  const L1 = luminance(...fgRGB);
  const L2 = luminance(...bgRGB);
  return (Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05);
}
// Consumers should extract computed colors and verify ratio >= 4.5 for normal text
`,
  },
];

export function getChallengeBySlug(slug: string) {
  return challenges.find((challenge) => challenge.slug === slug);
}

export function getChallengeStarterCode(slug: string) {
  return getChallengeBySlug(slug)?.starterCode ?? "<!doctype html><html><body></body></html>";
}

