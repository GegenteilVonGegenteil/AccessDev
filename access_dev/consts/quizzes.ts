import type { Question, Quiz } from "./structures";

const createQuiz = (id: string, name: string, description: string, questions: Question[]): Quiz => ({
  type: "quiz",
  id,
  name,
  description,
  questions,
  link: [`/app/quiz/${id}`],
});

const QUIZ_1_QUESTIONS: Question[] = [
  {
    id: "quiz-1-q1",
    text: "What percentage of the world's population experiences some form of disability?",
    options: [
      { id: "a", text: "Around 2%" },
      { id: "b", text: "Around 7%" },
      { id: "c", text: "Around 16%" },
      { id: "d", text: "Around 32%" },
    ],
    correctOptionId: "c",
    explanation:
      "The WHO estimates 1 in 6 people globally experience significant disability. Many of them use the web daily, facing barriers that could be avoided with considerate design and development.",
    link: ["https://www.who.int/news-room/fact-sheets/detail/disability-and-health"],
  },
  {
    id: "quiz-1-q2",
    text: "What does web accessibility mean?",
    options: [
      { id: "a", text: "Ensuring websites meet legal compliance requirements" },
      { id: "b", text: "Designing websites so everyone can perceive, navigate and interact with them, regardless of ability or context" },
      { id: "c", text: "Making websites look good on mobile screens" },
      { id: "d", text: "Ensuring websites load quickly on all devices" },
    ],
    correctOptionId: "b",
    explanation:
      "Web accessibility means ensuring anyone can perceive, understand, navigate and interact with the web. While the needs of disabled users are at its core, accessibility ultimately serves everyone. That includes someone using a screen reader, navigating by keyboard, or relying on captions in a noisy environment.",
    link: ["https://www.w3.org/WAI/fundamentals/accessibility-intro/"],
  },
  {
    id: "quiz-1-q3",
    text: "What does WCAG stand for?",
    options: [
      { id: "a", text: "Web Compatibility and Graphics" },
      { id: "b", text: "Wide Content Accessibility Group" },
      { id: "c", text: "Web Content Accessibility Guidelines" },
      { id: "d", text: "Web Code Audit Guidelines" },
    ],
    correctOptionId: "c",
    explanation:
      "WCAG stands for Web Content Accessibility Guidelines. Developed by the W3C, they are the internationally recognised standard for making web content accessible. They offer further standards for authoring tools (ATAG) and user agents (UAAG).",
    link: ["https://www.w3.org/WAI/standards-guidelines/wcag/"],
  },
  {
    id: "quiz-1-q4",
    text: "Which metric has been shown to improve when a website is made with accessibility in mind?",
    options: [
      { id: "a", text: "User engagement and reach" },
      { id: "b", text: "SEO and search ranking" },
      { id: "c", text: "Page load time" },
      { id: "d", text: "All of the above" },
    ],
    correctOptionId: "d",
    explanation:
      "Accessibility and good business outcomes are more aligned than most developers expect. Semantic HTML, clear structure, and descriptive labels improve Search Engine Optimization. These same qualities can also contribute to fater load times and overall user experience. And the more accessible your site is, the more people can use it!",
    link: ["https://accessibility-test.org/blog/compliance/ada/10-key-benefits-of-making-your-website-accessible-in-2025/"],
  },
  {
    id: "quiz-1-q5",
    text: "What is the minimum WCAG AA contrast ratio for normal body text?",
    options: [
      { id: "a", text: "2.5:1" },
      { id: "b", text: "3:1" },
      { id: "c", text: "4.5:1" },
      { id: "d", text: "7:1" },
    ],
    correctOptionId: "c",
    explanation:
      "4.5:1 is the minimum for normal text at WCAG AA. Large text (18pt+ or 14pt+ bold) requires 3:1. WCAG AAA raises the bar to 7:1 for normal text.",
    link: ["https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html"],
  },
  
];

const QUIZ_2_QUESTIONS: Question[] = [
  {
    id: "quiz-2-q1",
    text: "A designer uses red and green to indicate errors and success states. What is the problem?",
    options: [
      { id: "a", text: "People with colour blindness may not be able to distinguish them" },
      { id: "b", text: "It's not visually appealing" },
      { id: "c", text: "It conflicts with WCAG contrast requirements" },
      { id: "d", text: "It only works on certain operating systems" },
    ],
    correctOptionId: "a",
    explanation:
      "Around 300 Million people worldwide (1 in 12 men and 1 in 200 women) have some form of colour vision deficiency, with red-green being the most common. Using colour as the only way to convey meaning, like error or success states, excludes these users entirely. A simple fix is pairing colour with an icon, label, or pattern.",
    link: ["https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html"],
  },
  {
    id: "quiz-2-q2",
    text: "How many disabled users rely on screen readers?",
    options: [
      { id: "a", text: "Around 20%" },
      { id: "b", text: "Around 50%" },
      { id: "c", text: "Around 70%" },
      { id: "d", text: "Around 90%" },
    ],
    correctOptionId: "d",
    explanation:
      "According to the WebAIM Screen Reader User Survey, around 87.6% of disabled users rely on screen readers. This groups includes people with visual impairments, but also many users with other disabilities who find screen readers helpful for navigating the web.",
    link: ["https://www.accessibilitychecker.org/blog/screen-readers/"],
  },
  {
    id: "quiz-2-q3",
    text: "A purely decorative image should have which alt value?",
    options: [
      { id: "a", text: 'An empty string: alt=""' },
      { id: "b", text: "The filename" },
      { id: "c", text: "A description of what it looks like" },
      { id: "d", text: "No alt attribute at all" },
    ],
    correctOptionId: "a",
    explanation:
      'alt="" tells screen readers to skip the image entirely. Omitting the alt attribute altogether causes some readers to announce the filename instead. This adds needless noise to users of assistive technology',
    link: ["https://www.w3.org/WAI/tutorials/images/decorative/"],
  },
  {
    id: "quiz-2-q4",
    text: "A form input has a visible label next to it, but no <label> element in the HTML. What's the problem?",
    options: [
      { id: "a", text: "Nothing. If it looks right, it works" },
      { id: "b", text: "The form won't submit" },
      { id: "c", text: "Screen readers won't associate the label with the input" },
      { id: "d", text: "It will fail CSS validation" },
    ],
    correctOptionId: "c",
    explanation:
      "Visual proximity means nothing to assistive technology. The <label> element (or aria-labelledby) creates the programmatic link a screen reader needs to announce what a field is for.",
    link: ["https://www.w3.org/WAI/tutorials/forms/labels/"],
  },
  {
    id: "quiz-2-q5",
    text: "A form shows an error message when submission fails, but the user is on a screen reader. What would happen?",
    options: [
      { id: "a", text: "Error messages are always read automatically" },
      { id: "b", text: "If not properly marked, the error is never announced"},
      { id: "c", text: "Screen readers detect DOM changes and announce them" },
      { id: "d", text: "The form won't work at all" },
    ],
    correctOptionId: "b",
    explanation:
      "Screen readers only announce content changes if the element has aria-live, an alert role, or if focus is explicitly moved to the message. Without these, the user struggles to find the error message or may not even know it exists.",
    link: ["https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA19"],
  },
];

const QUIZ_3_QUESTIONS: Question[] = [
  {
    id: "quiz-3-q1",
    text: "What happens when a screen reader user navigates to an <input> with no associated label?",
    options: [
      { id: "a", text: "It reads the placeholder text" },
      { id: "b", text: 'It reads "edit text" or just the input type with no context' },
      { id: "c", text: "It skips the input entirely" },
      { id: "d", text: "It reads the surrounding paragraph" },
    ],
    correctOptionId: "b",
    explanation:
      "Placeholder text is not a label substitute. It disappears on input and is often low contrast. Without a label, screen reader users have no reliable way to know what a field is for.",
    link: ["https://www.w3.org/WAI/tutorials/forms/labels/"],
  },
  {
    id: "quiz-3-q2",
    text: 'What is the difference between aria-live="polite" and role="alert"?',
    options: [
      { id: "a", text: "There is no difference" },
      { id: "b", text: 'role="alert" only works in forms' },
      { id: "c", text: "polite is for errors, alert is for success messages" },
      { id: "d", text: "polite waits for the user to finish their current action before announcing, alert interrupts immediately" },
    ],
    correctOptionId: "d",
    explanation:
      'For critical errors like form validation failures, role="alert" (or aria-live="assertive") ensures the message is announced immediately. aria-live="polite" is better for non-urgent updates that can wait until the user is idle.',
    link: ["https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions"],
  },
  {
    id: "quiz-3-q3",
    text: "Beyond screen reader users, who else benefits from a well-structured, semantic HTML layout?",
    options: [
      { id: "a", text: "No one. Semantic HTML is specifically for screen readers" },
      { id: "b", text: "Keyboard-only users, since landmarks and headings aid navigation" },
      { id: "c", text: "Users with cognitive disabilities, since clear structure aids comprehension" },
      { id: "d", text: "Both b and c, but also search engines, voice assistants, and users in general" },
    ],
    correctOptionId: "d",
    explanation:
      "Semantic, well-structured HTML benefits far more than screen reader users. Keyboard users rely on landmarks and headings to navigate efficiently. Users with cognitive disabilities benefit from predictable, clearly structured content. Search engines and voice assistants also parse semantic structure to understand page content.",
    link: ["https://www.w3.org/WAI/fundamentals/accessibility-usability-inclusion/"],
  },
  {
    id: "quiz-3-q4",
    text: "What are alternative ways to navigate a website besides scrolling and clicking?",
    options: [
      { id: "a", text: "There are no widely-used alternatives" },
      { id: "b", text: "Keyboard navigation only" },
      { id: "c", text: "Keyboard navigation and voice control" },
      { id: "d", text: "Keyboard, voice control and eye tracking" },
    ],
    correctOptionId: "d",
    explanation:
      "Many users navigate entirely by keyboard, voice control or eye tracking. All of these rely on well-structured, keyboard-accessible interfaces.",
    link: ["https://www.w3.org/WAI/people-use-web/tools-techniques/input/"],
  },
  {
    id: "quiz-3-q5",
    text: "What determines the order in which interactive elements are focused when navigating by keyboard?",
    options: [
      { id: "a", text: "Their DOM order, which can be modified using tabindex" },
      { id: "b", text: "The order CSS rules are declared" },
      { id: "c", text: "Their visual position on the page" },
      { id: "d", text: "The browser's built-in accessibility settings" },
    ],
    correctOptionId: "a",
    explanation: `
    By default, focus moves through interactive elements in the order they appear in the HTML, not how they look on screen. Developers can use tabindex to modify this order. Setting tabindex="0" adds any element to the natural tab flow, while tabindex="-1" removes it. Positive values like tabindex="1" force a specific order. However, this can lead to a tab sequence that doesn't match users expectations and can be hard to maintain`,
    link: ["https://www.w3.org/WAI/WCAG21/Understanding/focus-order.html"],
  },
];

const QUIZ_4_QUESTIONS: Question[] = [
  {
    id: "quiz-4-q1",
    text: "A <div> has an onClick handler. What critical things are missing for keyboard users?",
    options: [
      { id: "a", text: "Nothing. onClick is called on Enter too" },
      { id: "b", text: "Focus, keyboard event handling, and an implicit role" },
      { id: "c", text: "Only an aria-label" },
      { id: "d", text: "Only a visible focus style" },
    ],
    correctOptionId: "b",
    explanation:
      "Native <button> elements give you focusability, Enter/Space activation, and an implicit ARIA role. A <div> gives you none of these. Always prefer the semantically correct HTML element.",
    link: ["https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html"],
  },
  {
    id: "quiz-4-q2",
    text: "What is a keyboard trap, and when is one acceptable?",
    options: [
      { id: "a", text: "When Tab doesn't work at all" },
      { id: "b", text: "When focus is locked inside a component. Never acceptable" },
      { id: "c", text: "When focus is locked inside a component. Acceptable in modals and dialogs" },
      { id: "d", text: "When a page has too many interactive elements" },
    ],
    correctOptionId: "c",
    explanation:
      "WCAG 2.1.2 prohibits keyboard traps except where trapping focus is intentional and the user can escape (e.g., by pressing the Escape key), such as open modals, where users shouldn't be able to Tab behind the dialog.",
    link: ["https://www.w3.org/WAI/WCAG21/Understanding/no-keyboard-trap.html"],
  },
  {
    id: "quiz-4-q3",
    text: "Automated tools can catch what proportion of accessibility issues?",
    options: [
      { id: "a", text: "Less than 10%" },
      { id: "b", text: "Around 20–40%" },
      { id: "c", text: "About 50-70%" },
      { id: "d", text: "About 80-90%" },
    ],
    correctOptionId: "b",
    explanation:
      "While automated tools (e.g. axe-core) are a great tool to use, their coverage is limited. They can catch structural issues reliably but can't assess whether alt text is meaningful, whether focus order makes logical sense, or whether content is understandable. Manual testing, including with real assistive technology, is irreplaceable. Using multiple tools and methods is the best way to catch a wide range of issues.",
    link: ["https://www.sitelint.com/blog/accessibility-automated-website-scans-and-how-much-can-they-catch"],
  },
  {
    id: "quiz-4-q4",
    text: "What is the single most effective time to address accessibility in a project?",
    options: [
      { id: "a", text: "During the design and development phase" },
      { id: "b", text: "During the testing phase" },
      { id: "c", text:  "Before launch" },
      { id: "d", text: "After the first user complaint" },
    ],
    correctOptionId: "a",
    explanation:
      "Retrofitting accessibility is significantly more expensive than building it in from the start. The issues you just fixed would take minutes in a new project, but hours in a legacy codebase.",
    link: ["https://www.w3.org/WAI/business-case/"],
  },
  {
    id: "quiz-4-q5",
    text: "According to the 2025 WebAIM Million report, what percentage of the top 1 million home pages had detectable accessibility failures?",
    options: [
      { id: "a", text: "Around 50%" },
      { id: "b", text: "Around 70%" },
      { id: "c", text: "Around 85%" },
      { id: "d", text: "Around 95%" },
    ],
    correctOptionId: "d",
    explanation:
      "In 2026, 95.9% of the top 1 million home pages had detectable WCAG failures, averaging 56.1 accessibility errors per page. It means the overwhelming majority of the web is failing a significant portion of its users, every day. You have already taken a great step in becoming part of the solution.",
    link: ["https://webaim.org/projects/million/"],
  },
];

export const quizzes = [
  createQuiz(
    "quiz-1",
    "Introductory Quiz",
    "What is web accessibility and why does it matter?",
    QUIZ_1_QUESTIONS
  ),
  createQuiz(
    "quiz-2",
    "Quiz 2",
    "Reflection on colours and how to accommodate screen reader users.",
    QUIZ_2_QUESTIONS
  ),
  createQuiz(
    "quiz-3",
    "Quiz 3",
    "Reflection on screen reader user experience and keyboard navigation.",
    QUIZ_3_QUESTIONS
  ),
  createQuiz(
    "quiz-4",
    "Quiz 4",
    "Reflection on keyboard navigation and the state of web accessibility in 2025.",
    QUIZ_4_QUESTIONS
  ),

];

export const quizzesBySlug = quizzes.reduce<Record<string, Quiz>>((accumulator, quiz) => {
  accumulator[quiz.id] = quiz;
  return accumulator;
}, {});

export function getQuizBySlug(slug: string) {
  return quizzesBySlug[slug];
}
