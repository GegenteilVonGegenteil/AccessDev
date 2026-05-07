import type { Course, Question, Quiz } from "./structures";

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

// Starter code templates
const HTML_BOILERPLATE = (title: string, style: string, body: string) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
      :root {
        color-scheme: light;
        font-family: Inter, Arial, sans-serif;
      }
${style}
    </style>
  </head>
  <body>
${body}
  </body>
</html>`;

// Factory function for cleaner challenge creation
const createChallenge = (
  id: number,
  slug: string,
  title: string,
  subtitle: string,
  type: ChallengeType,
  objective: string,
  config: {
    starterCode: string;
    previewTitle: string;
    previewDescription: string;
    errors: string[];
    hints: string[];
    validation?: string;
  }
): ChallengeDefinition => ({
  id,
  slug,
  title,
  subtitle,
  type,
  objective,
  ...config,
});

export const challenges: ChallengeDefinition[] = [
  createChallenge(
    1,
    "keyboard-navigation",
    "Keyboard Navigation",
    "Keyboard accessibility (tab order, focusable controls)",
    "keyboard-navigation",
    "Make the target link reachable with exactly two Tab presses from the start of the page and ensure it is a proper interactive element.",
    {
      starterCode: HTML_BOILERPLATE(
        "Button Demo",
        `
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
      nav a { margin-right: 12px }`,
        `    <main class="container">
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
    </main>`
      ),
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
    }
  ),
  createChallenge(
    2,
    "screen-reader",
    "Form Labels",
    "Form labeling and accessible names for inputs",
    "screen-reader",
    "Ensure each form field has a proper accessible name via a <label> or aria attributes so screen readers announce them correctly.",
    {
      starterCode: HTML_BOILERPLATE(
        "Announcement Demo",
        `
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
      }`,
        `      <main class="card">
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
      </main>`
      ),
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
    }
  ),
  createChallenge(
    3,
    "contrast",
    "Color Contrast",
    "Fix low contrast so text and controls meet WCAG thresholds",
    "contrast",
    "Adjust colors so normal text meets a 4.5:1 contrast ratio (or 3:1 for large text).",
    {
      starterCode: HTML_BOILERPLATE(
        "Contrast Demo",
        `
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
      }`,
        `    <section class="card">
      <h1 id="sample-title" class="sample-title">Contrast Demo</h1>
      <p id="sample-body" class="sample-body">Improve the contrast to make this easier to read.</p>
      <button id="sample-button" class="sample-button" type="button">Continue</button>
    </section>`
      ),
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
      validation: `function luminance(r,g,b){
  const a=[r,g,b].map(v=>{
    v/=255; return v<=0.03928? v/12.92 : Math.pow((v+0.055)/1.055,2.4);
  });
  return 0.2126*a[0]+0.7152*a[1]+0.0722*a[2];
}
function contrastRatio(fgRGB, bgRGB){
  const L1 = luminance(...fgRGB);
  const L2 = luminance(...bgRGB);
  return (Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05);
}`,
    }
  ),
];

export function getChallengeBySlug(slug: string) {
  return challenges.find((challenge) => challenge.slug === slug);
}

export function getChallengeStarterCode(slug: string) {
  return getChallengeBySlug(slug)?.starterCode ?? "<!doctype html><html><body></body></html>";
}

// -------------------------
// Course definition
// -------------------------

// Reusable question used across multiple quizzes
const ALT_TEXT_QUESTION: Question = {
  id: "q1",
  text: "What is the purpose of alt text for images?",
  options: [
    { id: "a1", text: "To provide a description of the image for screen readers" },
    { id: "a2", text: "To improve SEO rankings" },
    { id: "a3", text: "To add a caption to the image" },
  ],
  correctOptionId: "a1",
  furtherExplanation: "Alt text is used to describe images for users who rely on screen readers, ensuring they can understand the content of the image.",
  topic: "Accessibility Basics",
  link: ["https://www.w3.org/WAI/tutorials/images/decision-tree/"]
};

const createQuiz = (id: string, title: string, subtitle: string, questions: Question[]): Quiz => ({
  id,
  title,
  subtitle,
  questions,
  link: [`app/quiz/${id.split("-")[1]}`],
});

export const course: Course = {
  steps: [
    createQuiz("quiz-1", "Introductory Quiz", "Test your knowledge on accessibility basics", [ALT_TEXT_QUESTION]),
    {
      id: "challenge-1",
      title: "Keyboard Navigation Challenge",
      subtitle: "Make a simple webpage navigable using only the keyboard",
      description: "Create a webpage with a header, a main content area, and a footer. Ensure that all interactive elements can be accessed and used with keyboard navigation.",
      starterCode: "",
      solutionCode: "",
      link: ["/app/challenges/keyboard-navigation"]
    },
    createQuiz("quiz-2", "Quiz 2", "Reflect on keyboard navigation and screen reader basics", [ALT_TEXT_QUESTION]),
    {
      id: "challenge-2",
      title: "Screen Reader Challenge",
      subtitle: "Make sure your website gives usable screen reader output",
      description: "Create a webpage with a header, a main content area, and a footer. Ensure that all interactive elements can be accessed and used with keyboard navigation.",
      starterCode: "",
      solutionCode: "",
      link: ["/app/challenges/screen-reader"]
    },
    createQuiz("quiz-3", "Quiz 3", "Reflect on screen reader accessibility and contrast basics", [ALT_TEXT_QUESTION]),
    {
      id: "challenge-3",
      title: "Contrast Challenge",
      subtitle: "Ensure your webpage has sufficient color contrast",
      description: "Create a webpage with a header, a main content area, and a footer. Ensure that all text has sufficient contrast against its background.",
      starterCode: "",
      solutionCode: "",
      link: ["/app/challenges/contrast"]
    }
  ]
};

