import type { Course, CourseStep } from "./structures";
import { getQuizBySlug } from "./quizzes";
import { getChallengeBySlug } from "./challenges";

// get the course steps by combining quizzes and challenges
export const course: Course = {
  steps: getCourseSteps(),
};

// helper function to get the course steps
export function getCourseSteps(): CourseStep[] {
  return [
    getQuizBySlug("quiz-1")!,

    getChallengeBySlug("contrast")!,

    getQuizBySlug("quiz-2")!,

    getChallengeBySlug("screen-reader")!,

    getQuizBySlug("quiz-3")!,

    getChallengeBySlug("keyboard-navigation")!,

    getQuizBySlug("quiz-4")!,
  ];
}