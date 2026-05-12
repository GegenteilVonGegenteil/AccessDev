export type ChallengeType = "keyboard-navigation" | "screen-reader" | "contrast";

export type Resource = {
  label: string;
  href: string;
};

export type ChallengeDefinition = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  type: ChallengeType;
  description: string;
  objective: string;
  starterCode: string;
  errors: string[];
  hints: string[];
  validation?: string;
  resources: Resource[];
};

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

const createChallenge = (
  id: number,
  slug: string,
  title: string,
  subtitle: string,
  type: ChallengeType,
  description: string,
  objective: string,
  config: {
    starterCode: string;
    errors: string[];
    hints: string[];
    validation?: string;
    resources: Resource[];
  }
): ChallengeDefinition => ({
  id,
  slug,
  title,
  subtitle,
  type,
  description,
  objective,
  ...config,
});

export const challenges: ChallengeDefinition[] = [
  createChallenge(
    1,
    "contrast",
    "Color Contrast",
    "Color Contrast Ratio Requirements",
    "contrast",
    "For this challenge, you are given a simple webpage with a title, body text and a button, seeing through the eyes of a person with low vision. The colors used do not meet accessibility contrast requirements, making it difficult for some users to read the content. Your task is to adjust the colors of the title, body text and button to ensure they meet the necessary contrast ratios for accessibility.",
    "Adjust colors of the title, body text, and button to meet contrast requirements.",
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
      errors: [
        "The title contrast is below AA.",
        "The body text contrast is below AA.",
        "The button contrast is below AA.",
      ],
      hints: [
        "The tile should be darker to meet the necessary ratio (3:1). Try using the color picker or adjust .sample-title",
        "The body text should be darker to meet the necessary ratio (4.5:1). Try using the color picker or adjust .sample-body",
        "The button text should have higher contrast against the background. Use the color picker to adjust either the background or text color. Alternatively, adjust .sample-button colors directly.",
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
      resources: [
        {
          label: "W3C WCAG 2.1 Contrast (Minimum) - Level AA",
          href: "https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html",
        },
        {
          label: "WebAIM Contrast Checker",
          href: "https://webaim.org/resources/contrastchecker/",
        },
      ],
    }
  ),
  createChallenge(
    2,
    "screen-reader",
    "Screen Reader",
    "Adjust form labels and states for proper screen reader output",
    "screen-reader",
    "For this challenge, you are given a simple contact form with three input fields and a submit button. You will see this through the output a screen reader would offer. The form is not properly labeled, the button text is vague, and status updates are not announced to screen reader users. Your task is to adjust the form markup, button text, and status region to ensure that screen reader users can understand and interact with the form effectively.",
    "Adjust form markup, button text and status region to ensure usablility for screen reader users. ",
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
          <input id="name" type="text" placeholder="Full name" />

          <input id="nickname" type="text" placeholder="Nickname" />

          <input id="email" type="email" placeholder="Email" />

          <button type="submit">Click here</button>
        </form>

        <div class="status">Waiting for action...</div>
      </main>`
      ),
      errors: [
        "Inputs lack associated <label> elements or aria-label attributes.",
        "The main action button uses vague language.",
        "Changes in status are not announced.",
      ],
      hints: [
        "For each input, provide a corresponding <label for=\"id\"> or aria-label=\"label text\".",
        "Use a specific button name instead of 'Click here' (e.g., 'Submit').",
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
      resources: [
        {
          label: "W3C WAI Form Labeling Techniques",
          href: "https://www.w3.org/WAI/tutorials/forms/labels/",
        },
        {
          label: "MDN Label Element",
          href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/label",
        },
        {
          label: "MDN ARIA Live Regions",
          href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions",
        },
      ],
    }
  ),
  createChallenge(
    3,
    "keyboard-navigation",
    "Keyboard Navigation",
    "Keyboard accessibility (tab order, focusable controls)",
    "keyboard-navigation",
    "For this exercise, you can only interact with the website preview by using keyboard navigation. All but one button show issues dirsupting the tab order or focusability.",
    "Make all interactive elements focusable and ensure a logical tab order. Remove any keyboard traps and use semantically correct elements for interactive controls.",
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
        padding: 16px;
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

      <button type="button" class="clickable">Natural Tab Order</button>
      <button id="target" type="button" tabindex="-1" class="clickable">Negative tabindex</button>
    
      <div class="clickable" role="button" onclick="alert('div clicked')">Div Button</div>

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
      errors: [
        "Button has tabindex=\"-1\" and is skipped by Tab.",
        "Non-interactive elements are used for interactive purposes.",
        "Positive tabindex values disrupt natural focus order.",
        "An element traps keyboard focus and blocks normal Tab navigation.",
      ],
      hints: [
        "Remove tabindex=\"-1\" from the button to make it focusable in natural order.",
        "Replace decorative divs with <button> (same page effect) or <a> (redirect) when they perform actions.",
        "Remove positive tabindex values (e.g., tabindex=\"2\") to restore natural order.",
        "Remove any key handlers that prevent Tab from moving focus forward.",
      ],
      resources: [
        {
          label: "MDN Guide to Keyboard Navigation",
          href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Understanding_WCAG/Keyboard",
        },
        {
          label: "W3C WCAG 2.1.1 Keyboard Accessible (Level AA)",
          href: "https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html",
        },
        {
          label: "WCAG Focus Order",
          href: "https://wcag.dock.codes/documentation/wcag243/",
        },
      ],
    }
  ),

];

export function getChallengeBySlug(slug: string) {
  return challenges.find((challenge) => challenge.slug === slug);
}
