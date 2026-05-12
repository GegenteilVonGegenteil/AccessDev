import type { Course, CourseStep } from "./structures";
import { getQuizBySlug } from "./quizzes";
import { getChallengeBySlug } from "./challenges";

export const course: Course = {
  steps: getCourseSteps(),
};

export function getCourseSteps(): CourseStep[] {
  return [
    getQuizBySlug("quiz-1")!,

    (function () {
      const ch = getChallengeBySlug("contrast");
      return {
        id: "challenge-1",
        title: ch?.title ?? "Contrast Challenge",
        subtitle: ch?.subtitle ?? "Ensure your webpage has sufficient color contrast",
        description: ch?.description ?? "",
        starterCode: ch?.starterCode ?? "",
        solutionCode: "",
        link: [`/app/challenges/${ch?.slug ?? "contrast"}/preview`],
      };
    })(),

    getQuizBySlug("quiz-2")!,

    (function () {
      const ch = getChallengeBySlug("screen-reader");
      return {
        id: "challenge-2",
        title: ch?.title ?? "Screen Reader Challenge",
        subtitle: ch?.subtitle ?? "Make sure your website gives usable screen reader output",
        description: ch?.description ?? "",
        starterCode: ch?.starterCode ?? "",
        solutionCode: "",
        link: [`/app/challenges/${ch?.slug ?? "screen-reader"}/preview`],
      };
    })(),

    getQuizBySlug("quiz-3")!,

    (function () {
      const ch = getChallengeBySlug("keyboard-navigation");
      return {
        id: "challenge-3",
        title: ch?.title ?? "Keyboard Navigation Challenge",
        subtitle: ch?.subtitle ?? "Make a simple webpage navigable using only the keyboard",
        description: ch?.description ?? "",
        starterCode: ch?.starterCode ?? "",
        solutionCode: "",
        link: [`/app/challenges/${ch?.slug ?? "keyboard-navigation"}/preview`],
      };
    })(),
    getQuizBySlug("quiz-4")!,
  ];
}

