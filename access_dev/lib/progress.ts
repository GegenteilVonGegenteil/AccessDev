// storage keys
export const PROGRESS_STORAGE_KEY = "accessdev.course.progress";
export const CHALLENGES_STORAGE_KEY = "accessdev.challenges.completed";
export const QUIZZES_STORAGE_KEY = "accessdev.quizzes.completed";

// array of the completed steps
export type CourseProgress = {
  completedStepIds: string[];
};

// holds challenge completion related data
export type ChallengeCompletion = {
  slug: string;
  resolvedCount: number;
  totalCount: number;
  hintsUsed: number;
};

// holds all completed challenges
export type ChallengesProgress = {
  completed: Record<string, ChallengeCompletion>;
};

// holds quiz completion related data
export type QuizCompletion = {
  slug: string;
  correctCount: number;
  totalCount: number;
};

// holds all completed quizzes
export type QuizzesProgress = {
  completed: Record<string, QuizCompletion>;
};

// default values for progress
const defaultProgress: CourseProgress = {
  completedStepIds: [],
};

const defaultChallengesProgress: ChallengesProgress = {
  completed: {},
};

const defaultQuizzesProgress: QuizzesProgress = {
  completed: {},
};

// gets the users progress from local storage
export function getCourseProgress(): CourseProgress {
  if (typeof window === "undefined") return defaultProgress;

  try {
    const rawValue = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!rawValue) return defaultProgress;

    // parse stored values into CourseProgress
    const parsed = JSON.parse(rawValue) as Partial<CourseProgress>;
    if (!Array.isArray(parsed.completedStepIds)) return defaultProgress;

  
    return {
      completedStepIds: parsed.completedStepIds
    };
  } catch {
    return defaultProgress;
  }
}

// get the challenges progress from local storage
export function getChallengesProgress(): ChallengesProgress {
  if (typeof window === "undefined") return defaultChallengesProgress;

  try {
    const rawValue = window.localStorage.getItem(CHALLENGES_STORAGE_KEY);
    if (!rawValue) return defaultChallengesProgress;

    const parsed = JSON.parse(rawValue) as Partial<ChallengesProgress>;
    if (!parsed.completed || typeof parsed.completed !== "object") return defaultChallengesProgress;

    return {
      completed: parsed.completed,
    };
  } catch {
    return defaultChallengesProgress;
  }
}

// get the quizzes progress from local storage
export function getQuizzesProgress(): QuizzesProgress {
  if (typeof window === "undefined") return defaultQuizzesProgress;

  try {
    const rawValue = window.localStorage.getItem(QUIZZES_STORAGE_KEY);
    if (!rawValue) return defaultQuizzesProgress;

    const parsed = JSON.parse(rawValue) as Partial<QuizzesProgress>;
    if (!parsed.completed || typeof parsed.completed !== "object") return defaultQuizzesProgress;

    return {
      completed: parsed.completed,
    } as QuizzesProgress;
  } catch {
    return defaultQuizzesProgress;
  }
}

// saves the different progress objects to local storage
export function saveCourseProgress(progress: CourseProgress): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
}

export function saveChallengesProgress(progress: ChallengesProgress): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CHALLENGES_STORAGE_KEY, JSON.stringify(progress));
}

export function saveQuizzesProgress(progress: QuizzesProgress): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(QUIZZES_STORAGE_KEY, JSON.stringify(progress));
}

// adds a challenge to the completed challenge list, inclduing how many erors were fixed and how many gints were used
export function markChallengeCompleted(
  slug: string,
  resolvedCount: number,
  totalCount: number,
  hintsUsed: number = 0
): ChallengesProgress {
  const current = getChallengesProgress();
  const next: ChallengesProgress = {
    completed: {
      ...current.completed,
      [slug]: {
        slug,
        resolvedCount,
        totalCount,
        hintsUsed,
      },
    },
  };

  saveChallengesProgress(next);
  return next;
}

// adds a quiz to the completed quiz list, including how many questions were answered correctly
export function markQuizCompleted(slug: string, correctCount: number, totalCount: number): QuizzesProgress {
  const current = getQuizzesProgress();
  const next: QuizzesProgress = {
    completed: {
      ...current.completed,
      [slug]: {
        slug,
        correctCount,
        totalCount
      },
    },
  };

  saveQuizzesProgress(next);
  return next;
}

// adds a step to the completed step list
export function markStepCompleted(stepId: string): CourseProgress {
  const current = getCourseProgress();
  // don't add step if already completed
  if (current.completedStepIds.includes(stepId)) {
    return current;
  }

  const next: CourseProgress = {
    completedStepIds: [...current.completedStepIds, stepId],
  };

  saveCourseProgress(next);
  return next;
}