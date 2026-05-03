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
};

export const challenges: ChallengeDefinition[] = [
  {
    id: 1,
    slug: "keyboard-navigation",
    title: "Keyboard Navigation",
    subtitle: "Fix the focus order and make every control reachable with the keyboard.",
    type: "keyboard-navigation",
    objective: "Repair broken keyboard navigation in the preview.",
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
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Button Demo</h2>
      <p>Make the button clickable:</p>
      <div class="clickable" onclick="alert('Clicked!')">Click Me</div>
    </div>
  </body>
</html>`,
    previewTitle: "Keyboard Trap Demo",
    previewDescription: "The preview includes a broken menu and a skipped focus target. Your job is to restore predictable tab order and visible focus.",
    errors: [
      "Tab order skips an interactive control.",
      "A menu item cannot be reached with the keyboard.",
      "Focused elements do not have a visible state.",
    ],
    hints: [
      "Check the DOM order before adding JavaScript focus management.",
      "Use semantic buttons and links instead of clickable divs.",
      "Make sure the preview shows a focus ring or outline.",
    ],
  },
  {
    id: 2,
    slug: "screen-reader",
    title: "Screen Reader Output",
    subtitle: "Repair labels, headings, and live announcements so the output makes sense.",
    type: "screen-reader",
    objective: "Make the preview announce meaningful text to assistive technology.",
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
      <h1>Welcome</h1>
      <h3>Announcement Demo</h3>
      <p>Press the action button to update the status.</p>
      <div class="status">Waiting for action...</div>
      <button type="button" onclick="document.querySelector('.status').textContent = 'Action complete!'">
        Do Thing
      </button>
    </main>
  </body>
</html>`,
    previewTitle: "Announcement Demo",
    previewDescription: "The preview is missing useful labels and has confusing heading structure. Fix the accessible output shown in the challenge runner.",
    errors: [
      "The main action button has no accessible name.",
      "Heading levels skip a section.",
      "Dynamic status text is not announced.",
    ],
    hints: [
      "Check aria-label, aria-labelledby, and visible text content.",
      "Keep heading levels sequential.",
      "Use an aria-live region for changing status text.",
    ],
  },
  {
    id: 3,
    slug: "contrast",
    title: "Colour Contrast",
    subtitle: "Improve foreground/background contrast until it passes accessibility checks.",
    type: "contrast",
    objective: "Adjust the preview colors so text and controls meet contrast requirements.",
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
      <p>Improve the contrast to make this easier to read.</p>
      <button class="cta" type="button">Continue</button>
    </section>
  </body>
</html>`,
    previewTitle: "Contrast Demo",
    previewDescription: "The preview intentionally uses low-contrast text and buttons. Increase contrast without destroying the visual design.",
    errors: [
      "Body text contrast is below WCAG AA.",
      "Button text is too faint against the background.",
      "Secondary metadata is hard to read.",
    ],
    hints: [
      "Use a contrast checker on the computed foreground and background colors.",
      "Aim for at least 4.5:1 for normal text.",
      "Try changing saturation or lightness before changing the full palette.",
    ],
  },
];

export function getChallengeBySlug(slug: string) {
  return challenges.find((challenge) => challenge.slug === slug);
}

export function getChallengeStarterCode(slug: string) {
  return getChallengeBySlug(slug)?.starterCode ?? "<!doctype html><html><body></body></html>";
}

