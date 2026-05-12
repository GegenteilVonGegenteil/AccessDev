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
    name: string;
    description: string;
    questions: Question[];
    link?: string[];
};

export type Challenge = {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    starterCode: string;
    solutionCode: string;
    link?: string[];
};

export type CourseStep = Quiz | Challenge;

export type Course = {
    steps: CourseStep[];
};