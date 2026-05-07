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
      <h2>Keyboard Navigation</h2>
      <p>Find and activate the target using Tab. The page contains focus-order and semantics problems.</p>

      <nav>
        <button type="button" class="clickable">Home</button>
        <button id="target" type="button" class="clickable">Go to Success</button>
      </nav>

      <div class="clickable" role="button" onclick="alert('div clicked')">Fake Button (div)</div>

      <button class="clickable" tabindex="2">Positive tabindex</button>

      <button
        id="trap"
        class="clickable"
        onkeydown="if (event.key === 'Tab') { event.preventDefault(); this.focus(); }"
      >
        Keyboard Trap Button
      </button>
    </main>
  </body>
</html>`,
    previewTitle: "Keyboard Navigation",
    previewDescription: "Focus order and focusable semantics are intentionally incorrect. Fix the order, remove positive tabindex values, stop trapping focus, and use proper interactive elements.",
    errors: [
      "Target control has tabindex=\"-1\" and is skipped by Tab.",
      "Non-interactive elements are used as controls (no keyboard support).",
      "Positive tabindex values disrupt natural focus order.",
      "An element traps keyboard focus and blocks normal Tab navigation.",
    ],
    hints: [
      "Replace decorative divs with <button> or <a> when they perform actions.",
      "Remove positive tabindex values (e.g., tabindex=\"2\") to restore natural order.",
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
          <label for="name">Full name</label>
          <input id="name" type="text" placeholder="Full name" />

          <input id="nickname" type="text" placeholder="Nickname" aria-label="Nickname" />

          <input id="email" type="email" placeholder="Email" />

          <button type="submit">Click here</button>
        </form>

        <div class="status">Waiting for action...</div>
      </main>
  </body>
</html>`,
      previewTitle: "Form Labeling",
      previewDescription: "A small form demonstrates proper and improper labeling patterns. Fix unlabeled inputs, give the button a clear name, and make the status region announce updates.",
      errors: [
        "Inputs lack associated <label> elements.",
        "The main action button has a vague accessible name.",
        "The status text is not announced because aria-live is missing.",
      ],
      hints: [
        "Add <label for=\"id\"> text and matching id attributes.",
        "Use a specific button name instead of 'Click here' (e.g., 'Send message').",
        "Add aria-live to the status region or use role=\"status\"/\"alert\" for announcements.",
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
        color: #a28ab9;
      }

      .card {
        display: grid;
        gap: 16px;
        padding: 32px;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.6);
      }

      .sample-title {
        color: #b49fcb;
      }

      .sample-body {
        color: #b59ccb;
      }

      .sample-button {
        border: 0;
        padding: 12px 18px;
        border-radius: 999px;
        background: #cfb5fb;
        color: #fbf8ff;
      }
    </style>
  </head>
  <body>
    <section class="card">
      <h1 id="sample-title" class="sample-title">Contrast Demo</h1>
      <p id="sample-body" class="sample-body">Improve the contrast to make this easier to read.</p>
      <button id="sample-button" class="sample-button" type="button">Continue</button>
    </section>
  </body>
</html>`,
    previewTitle: "Contrast Demo",
    previewDescription: "A focused contrast exercise with three targets: title, body text, and button. Use the ratio bar to adjust colors in the <style> block.",
    errors: [
      "The title contrast is below AA.",
      "The body text contrast is below AA.",
      "The button contrast is below AA.",
    ],
    hints: [
      "Make the title easier to read by increasing contrast in the .sample-title rule.",
      "Make the body copy darker or the background lighter via the body or .sample-body rule.",
      "Tune the button fill/text colors in .sample-button until the label meets the ratio.",
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

