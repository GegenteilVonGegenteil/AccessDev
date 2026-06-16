// definitions of different structures used in the course

export type Option = {
    id: string;
    text: string;
};

export type Question = {
    id: string;
    text: string;
    options: Option[];
    correctOptionId: string;
    explanation: string;
    link: string[];
};

export type Quiz = {
    type: "quiz";
    id: string;
    title: string;
    subtitle: string;
    questions: Question[];
    link?: string[];
};

export type ChallengeType = "keyboard-navigation" | "screen-reader" | "contrast";

export type Resource = {
    label: string;
    href: string;
};

export type Challenge = {
    id: string;
    slug: string;
    type: ChallengeType;
    title: string;
    subtitle: string;
    objective: string;
    description: string;
    starterCode: string;
    solutionCode: string;
    errors: string[];
    hints: string[];
    resources: Resource[];
    link: string[];
};

export type CourseStep = Quiz | Challenge;

export type Course = {
    steps: CourseStep[];
};