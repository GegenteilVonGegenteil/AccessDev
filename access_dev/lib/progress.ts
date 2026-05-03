export const PROGRESS_STORAGE_KEY = "accessdev.course.progress.v1";

export type CourseProgress = {
  completedStepIds: string[];
};

const defaultProgress: CourseProgress = {
  completedStepIds: [],
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

export function saveCourseProgress(progress: CourseProgress): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
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
