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
      { id: "a", text: "Around 5%" },
      { id: "b", text: "Around 16%" },
      { id: "c", text: "Around 30%" },
      { id: "d", text: "Around 45%" },
    ],
    correctOptionId: "b",
    explanation:
      "The WHO estimates 1 in 6 people globally experience significant disability — many of whom navigate the web daily.",
    link: ["https://www.who.int/news-room/fact-sheets/detail/disability-and-health"],
    },
  {
    id: "quiz-1-q2",
    text: "Which of these is NOT considered a web accessibility barrier?",
    options: [
      { id: "a", text: "A button with no label" },
      { id: "b", text: "Low colour contrast text" },
      { id: "c", text: "A website with a dark theme" },
      { id: "d", text: "A video with no captions" },
    ],
    correctOptionId: "c",
    explanation:
      "Dark themes aren't inherently inaccessible — contrast ratio is what matters, not the colour itself. A well-designed dark theme can be highly accessible.",
    link: ["https://www.w3.org/WAI/standards-guidelines/wcag/"],
  },
  {
    id: "quiz-1-q3",
    text: "In the UK, which law requires digital services to be accessible?",
    options: [
      { id: "a", text: "GDPR" },
      { id: "b", text: "The Equality Act 2010" },
      { id: "c", text: "The Digital Economy Act" },
      { id: "d", text: "The Data Protection Act" },
    ],
    correctOptionId: "b",
    explanation:
      "The Equality Act 2010 prohibits discrimination, including through inaccessible digital services. Public sector bodies also fall under the Public Sector Bodies Accessibility Regulations.",
  
    link: ["https://www.equalityhumanrights.com/en/what-we-do/protected-characteristics/disability"],
  },
  {
    id: "quiz-1-q4",
    text: "Which business metric has been shown to improve when accessibility is prioritised?",
    options: [
      { id: "a", text: "Server performance" },
      { id: "b", text: "SEO and search ranking" },
      { id: "c", text: "Database query speed" },
      { id: "d", text: "Deployment frequency" },
    ],
    correctOptionId: "b",
    explanation:
      "Accessible HTML — semantic structure, alt text, labels — is exactly what search engines index. Accessibility and SEO are deeply aligned.",
    link: ["https://www.w3.org/WAI/standards-guidelines/wcag/"],
  },
  {
    id: "quiz-1-q5",
    text: "Captions on videos were originally designed for deaf users. Who else benefits from them today?",
    options: [
      { id: "a", text: "Only non-native speakers" },
      { id: "b", text: "Only people in noisy environments" },
      { id: "c", text: "Only people on mobile" },
      { id: "d", text: "All of the above" },
    ],
    correctOptionId: "d",
    explanation:
      "This is the curb-cut effect — features built for specific disabilities end up helping everyone. Accessibility improvements are usability improvements.",
  
    link: ["https://www.w3.org/WAI/standards-guidelines/wcag/"],
  },
];

const QUIZ_2_QUESTIONS: Question[] = [
  {
    id: "quiz-2-q1",
    text: "What is the minimum WCAG AA contrast ratio for normal body text?",
    options: [
      { id: "a", text: "2.5:1" },
      { id: "b", text: "3:1" },
      { id: "c", text: "4.5:1" },
      { id: "d", text: "7:1" },
    ],
    correctOptionId: "c",
    explanation:
      "4.5:1 is required for normal text, 3:1 for large text (18pt+). WCAG AAA raises this to 7:1 for normal text.",
    link: ["https://www.w3.org/WAI/standards-guidelines/wcag/"],
  },
  {
    id: "quiz-2-q2",
    text: "Approximately how many people worldwide have some form of colour vision deficiency?",
    options: [
      { id: "a", text: "1 in 100" },
      { id: "b", text: "1 in 12" },
      { id: "c", text: "1 in 4" },
      { id: "d", text: "1 in 2" },
    ],
    correctOptionId: "b",
    explanation:
      "Around 300 million people globally — roughly 8% of men and 0.5% of women — have some form of colour vision deficiency.",
 
    link: ["https://www.colourblindawareness.org/colour-blindness/"],},
  {
    id: "quiz-2-q3",
    text: "A user increases their browser font size to 200%. What should happen to your layout?",
    options: [
      { id: "a", text: "It should stay exactly the same" },
      { id: "b", text: "It should break gracefully" },
      { id: "c", text: "It should reflow without horizontal scrolling" },
      { id: "d", text: "It should show a mobile view" },
    ],
    correctOptionId: "c",
    explanation:
      "WCAG 1.4.4 requires text to be resizable up to 200% without loss of content or functionality. Use relative units like rem and em rather than fixed px values.",
  
    link: ["https://www.w3.org/WAI/standards-guidelines/wcag/"],
  },
  {
    id: "quiz-2-q4",
    text: "A purely decorative image should have which alt value?",
    options: [
      { id: "a", text: "A description of what it looks like" },
      { id: "b", text: "The filename" },
      { id: "c", text: 'An empty string alt=""' },
      { id: "d", text: "No alt attribute at all" },
    ],
    correctOptionId: "c",
    explanation:
      'alt="" tells screen readers to skip the image entirely. Omitting alt altogether causes some readers to announce the filename instead, which is meaningless noise.',
    link: ["https://www.w3.org/WAI/standards-guidelines/wcag/"],
  },
  {
    id: "quiz-2-q5",
    text: "A form input has a visible label next to it, but no <label> element in the HTML. What's the problem?",
    options: [
      { id: "a", text: "Nothing — if it looks right, it works" },
      { id: "b", text: "Screen readers won't associate the label with the input" },
      { id: "c", text: "The form won't submit" },
      { id: "d", text: "It will fail CSS validation" },
    ],
    correctOptionId: "b",
    explanation:
      "Visual proximity means nothing to assistive technology. The <label> element — or aria-labelledby — creates the programmatic link a screen reader needs. This is exactly what the next challenge is about.",
    link: ["https://www.w3.org/WAI/standards-guidelines/wcag/"],
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
      "Placeholder text is not a label substitute — it disappears on input and is often low contrast. Without a label, users have no reliable way to know what a field is for.",
    link: ["https://www.w3.org/WAI/standards-guidelines/wcag/"],
  },
  {
    id: "quiz-3-q2",
    text: "A form shows an error message when submission fails, but the user is on a screen reader. What's the problem?",
    options: [
      { id: "a", text: "Error messages are always read automatically" },
      { id: "b", text: "Nothing — screen readers detect DOM changes" },
      { id: "c", text: "Without aria-live or focus management, the error is never announced" },
      { id: "d", text: "The form won't work at all" },
    ],
    correctOptionId: "c",
    explanation:
      "Screen readers only announce content changes if the element has aria-live, or if focus is explicitly moved to the message. Silent errors are invisible errors.",
    link: ["https://www.w3.org/WAI/standards-guidelines/wcag/"],
  },
  {
    id: "quiz-3-q3",
    text: 'What is the difference between aria-live="polite" and role="alert"?',
    options: [
      { id: "a", text: "There is no difference" },
      { id: "b", text: "polite waits for the user to finish their current action; alert interrupts immediately" },
      { id: "c", text: "polite is for errors, alert is for success messages" },
      { id: "d", text: "role=alert only works in forms" },
    ],
    correctOptionId: "b",
    explanation:
      'For critical errors like form validation failures, role="alert" (or aria-live="assertive") ensures immediate announcement. polite is better for non-urgent status updates.',
    link: ["https://www.w3.org/WAI/standards-guidelines/wcag/"],
  },
  {
    id: "quiz-3-q4",
    text: "Plain language and clear layout primarily helps which group?",
    options: [
      { id: "a", text: "Only users with dyslexia" },
      { id: "b", text: "Only non-native speakers" },
      { id: "c", text: "Only users with cognitive disabilities" },
      { id: "d", text: "All of the above" },
    ],
    correctOptionId: "d",
    explanation:
      "Cognitive accessibility improvements — clear headings, plain language, consistent layout — have the widest reach of almost any accessibility measure.",
    link: ["https://www.w3.org/WAI/standards-guidelines/wcag/"],
  },
  {
    id: "quiz-3-q5",
    text: 'What is a "skip to main content" link and who benefits from it?',
    options: [
      { id: "a", text: "A design pattern for mobile" },
      { id: "b", text: "A link that lets users bypass repeated navigation" },
      { id: "c", text: "An SEO technique" },
      { id: "d", text: "A React routing pattern" },
    ],
    correctOptionId: "b",
    explanation:
      "Without it, keyboard and screen reader users must tab through every nav item on every page load. It's one of the simplest wins in accessibility — and it leads directly into what the next challenge is about.",
    link: ["https://www.w3.org/WAI/standards-guidelines/wcag/"],
  },
];

const QUIZ_4_QUESTIONS: Question[] = [
  {
    id: "quiz-4-q1",
    text: "A developer sets tabindex=\"3\" on a button to control focus order. What's the problem?",
    options: [
      { id: "a", text: "Nothing — tabindex is designed for this" },
      { id: "b", text: "It removes the element from focus order" },
      { id: "c", text: "It creates a fragile, unpredictable tab sequence that breaks when the page changes" },
      { id: "d", text: "It only works in Chrome" },
    ],
    correctOptionId: "c",
    explanation:
      'Positive tabindex values override the natural DOM order globally, which becomes impossible to maintain at scale. The correct fix is almost always to reorder the DOM itself, using tabindex="0" only when you need to add a non-interactive element into the tab flow.',
    link: ["https://www.w3.org/WAI/standards-guidelines/wcag/"],
  },
  {
    id: "quiz-4-q2",
    text: "A <div> has an onClick handler. What critical things are missing for keyboard users?",
    options: [
      { id: "a", text: "Nothing — onClick fires on Enter too" },
      { id: "b", text: "Focus, keyboard event handling, and implicit role — it won't receive Tab focus or respond to Enter/Space" },
      { id: "c", text: "Only an aria-label" },
      { id: "d", text: "Only a visible focus style" },
    ],
    correctOptionId: "b",
    explanation:
      "Native <button> elements give you focusability, Enter/Space activation, and an implicit ARIA role for free. A <div> gives you none of these. Always prefer the semantically correct element.",
    link: ["https://www.w3.org/WAI/standards-guidelines/wcag/"],
  },
  {
    id: "quiz-4-q3",
    text: "What is a keyboard trap, and when is one acceptable?",
    options: [
      { id: "a", text: "When Tab doesn't work at all" },
      { id: "b", text: "When focus is locked inside a component — never acceptable" },
      { id: "c", text: "When focus is locked inside a component — acceptable in modals and dialogs" },
      { id: "d", text: "When a page has too many interactive elements" },
    ],
    correctOptionId: "c",
    link: ["https://www.w3.org/WAI/standards-guidelines/wcag/"],
    explanation:
      "WCAG 2.1.2 prohibits keyboard traps except where trapping focus is intentional and escapable — such as open modals, where users shouldn't be able to Tab behind the dialog.",
  },
  {
    id: "quiz-4-q4",
    text: "Automated tools like axe-core can catch what proportion of accessibility issues?",
    options: [
      { id: "a", text: "Almost all of them" },
      { id: "b", text: "About 70%" },
      { id: "c", text: "Around 30–40%" },
      { id: "d", text: "Less than 10%" },
    ],
    correctOptionId: "c",
    explanation:
      "Automated tools catch structural issues reliably but can't assess whether alt text is meaningful, whether focus order makes logical sense, or whether content is understandable. Manual testing — including with real assistive technology — is irreplaceable.",
    link: ["https://www.w3.org/WAI/standards-guidelines/wcag/"],
  },
  {
    id: "quiz-4-q5",
    text: "What is the single most effective time to address accessibility in a project?",
    options: [
      { id: "a", text: "During QA testing" },
      { id: "b", text: "After the first user complaint" },
      { id: "c", text: "During the design and development phase" },
      { id: "d", text: "Before launch" },
    ],
    correctOptionId: "c",
    link: ["https://www.w3.org/WAI/standards-guidelines/wcag/"],
    explanation:
      "Retrofitting accessibility is significantly more expensive than building it in from the start. The issues you just fixed would take minutes in a new project — and hours in a legacy codebase.",
  },
];

export const quizzes = [
  createQuiz(
    "quiz-1",
    "Why Accessibility Matters",
    "Before we dive in, let's establish why accessibility matters — for users, for businesses, and for the web as a whole.",
    QUIZ_1_QUESTIONS
  ),
  createQuiz(
    "quiz-2",
    "Perception & Visual Accessibility",
    "Let's reflect on what you just experienced and broaden your understanding of visual accessibility — including what comes next.",
    QUIZ_2_QUESTIONS
  ),
  createQuiz(
    "quiz-3",
    "Semantics & Assistive Technology",
    "Let's unpack what you just experienced — and lay the groundwork for the keyboard navigation challenge ahead.",
    QUIZ_3_QUESTIONS
  ),
  createQuiz(
    "quiz-4",
    "Putting It All Together",
    "You've completed all three challenges. Let's zoom out and make sure everything connects — technically, legally, and professionally.",
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
