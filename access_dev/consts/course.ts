import type { Course, CourseStep } from "./structures";
import { getQuizBySlug } from "./quizzes";
import { getChallengeBySlug } from "./challenges";

function getChallengeStep(
  id: string,
  slug: string,
  fallbackTitle: string,
  fallbackSubtitle: string
): CourseStep {
  const challenge = getChallengeBySlug(slug);

  if (challenge) {
    return {
      ...challenge,
      id,
      link: [`/app/challenges/${challenge.slug}/preview`],
    } as CourseStep;
  }

  // Fallback minimal challenge-shaped object for safety
  return {
    id,
    slug,
    type: "contrast",
    title: fallbackTitle,
    subtitle: fallbackSubtitle,
    objective: "",
    description: "",
    starterCode: "",
    solutionCode: "",
    errors: [],
    hints: [],
    resources: [],
    link: [`/app/challenges/${slug}/preview`],
  } as CourseStep;
}

export const course: Course = {
  steps: getCourseSteps(),
};

export function getCourseSteps(): CourseStep[] {
  return [
    getQuizBySlug("quiz-1")!,

    getChallengeStep(
      "challenge-1",
      "contrast",
      "Contrast Challenge",
      "Ensure sufficient color contrast"
    ),

    getQuizBySlug("quiz-2")!,

    getChallengeStep(
      "challenge-2",
      "screen-reader",
      "Screen Reader Challenge",
      "Make sure your website gives usable screen reader output"
    ),

    getQuizBySlug("quiz-3")!,

    getChallengeStep(
      "challenge-3",
      "keyboard-navigation",
      "Keyboard Navigation Challenge",
      "Make a simple webpage navigable using only the keyboard"
    ),
    getQuizBySlug("quiz-4")!,
  ];
}

