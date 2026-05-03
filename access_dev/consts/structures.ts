type Option = {
    id: string;
    text: string;
}

type Question = {
    id: string;
    text: string;
    options: Option[];
    correctOptionId: string;
    furtherExplanation: string;
    topic: string;
    link: string[];
}

type Quiz = {
    id: string;
    title: string;
    subtitle: string;
    questions: Question[];
    link?: string[];
};

type Challenge = {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    starterCode: string;
    solutionCode: string;
    link?: string[];
}

type Course = {
    steps: (Quiz | Challenge)[];
}

export type { Option, Question, Quiz, Challenge, Course };