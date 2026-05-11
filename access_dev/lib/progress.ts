export const PROGRESS_STORAGE_KEY = "accessdev.course.progress.v1";
export const CHALLENGES_STORAGE_KEY = "accessdev.challenges.completed.v1";

export type CourseProgress = {
  completedStepIds: string[];
};

export type ChallengeCompletion = {
  slug: string;
  resolvedCount: number;
  totalCount: number;
  hintsUsed: number;
  completedAt: number;
};

export type ChallengesProgress = {
  completed: Record<string, ChallengeCompletion>;
};

const defaultProgress: CourseProgress = {
  completedStepIds: [],
};

const defaultChallengesProgress: ChallengesProgress = {
  completed: {},
};

export function getCourseProgress(): CourseProgress {
  if (typeof window === "undefined") return defaultProgress;

  try {
    const rawValue = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!rawValue) return defaultProgress;

    const parsed = JSON.parse(rawValue) as Partial<CourseProgress>;
    if (!Array.isArray(parsed.completedStepIds)) return defaultProgress;

    return {
      completedStepIds: parsed.completedStepIds.filter((id): id is string => typeof id === "string"),
    };
  } catch {
    return defaultProgress;
  }
}

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

export function saveCourseProgress(progress: CourseProgress): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
}

export function saveChallengesProgress(progress: ChallengesProgress): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CHALLENGES_STORAGE_KEY, JSON.stringify(progress));
}

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
        completedAt: Date.now(),
      },
    },
  };

  saveChallengesProgress(next);
  return next;
}

export function markStepCompleted(stepId: string): CourseProgress {
  const current = getCourseProgress();
  if (current.completedStepIds.includes(stepId)) {
    return current;
  }

  const next: CourseProgress = {
    completedStepIds: [...current.completedStepIds, stepId],
  };

  saveCourseProgress(next);
  return next;
}

export function clearCourseProgress(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PROGRESS_STORAGE_KEY);
}
