import { Course } from "./structures";

export const course: Course = {
    steps: [
        {
            id: "quiz-1",
            title: "Introductory Quiz",
            subtitle: "Test your knowledge on accessibility basics",
            questions: [
                {
                    id: "q1",
                    text: "What is the purpose of alt text for images?",
                    options: [
                        { id: "a1", text: "To provide a description of the image for screen readers" },
                        { id: "a2", text: "To improve SEO rankings" },
                        { id: "a3", text: "To add a caption to the image" },
                    ],
                    correctOptionId: "a1",
                    furtherExplanation: "Alt text is used to describe images for users who rely on screen readers, ensuring they can understand the content of the image.",
                    topic: "Accessibility Basics",
                    link: ["https://www.w3.org/WAI/tutorials/images/decision-tree/"]
                },
            ],
            link: ["app/quiz/1"]
        },
        {
            id: "challenge-1",
            title: "Keyboard Navigation Challenge",
            subtitle: "Make a simple webpage navigable using only the keyboard",
            description: "Create a webpage with a header, a main content area, and a footer. Ensure that all interactive elements can be accessed and used with keyboard navigation.",
            starterCode: "",
            solutionCode: "",
            link: ["/app/challenges/keyboard-navigation"]
        },
        {
            id: "quiz-2",
            title: "Quiz 2",
            subtitle: "Reflect on keyboard navigation and screen reader basics",
            questions: [
                {
                    id: "q1",
                    text: "What is the purpose of alt text for images?",
                    options: [
                        { id: "a1", text: "To provide a description of the image for screen readers" },
                        { id: "a2", text: "To improve SEO rankings" },
                        { id: "a3", text: "To add a caption to the image" },
                    ],
                    correctOptionId: "a1",
                    furtherExplanation: "Alt text is used to describe images for users who rely on screen readers, ensuring they can understand the content of the image.",
                    topic: "Accessibility Basics",
                    link: ["https://www.w3.org/WAI/tutorials/images/decision-tree/"]
                },
            ],
            link: ["app/quiz/2"]
        },
        {
            id: "challenge-2",
            title: "Screen Reader Challenge",
            subtitle: "Make sure your website gives usable screen reader output",
            description: "Create a webpage with a header, a main content area, and a footer. Ensure that all interactive elements can be accessed and used with keyboard navigation.",
            starterCode: "",
            solutionCode: "",
            link: ["/app/challenges/screen-reader"]
        },
        {
            id: "quiz-3",
            title: "Quiz 3",
            subtitle: "Reflect on screen reader accessibility and contrast basics",
            questions: [
                {
                    id: "q1",
                    text: "What is the purpose of alt text for images?",
                    options: [
                        { id: "a1", text: "To provide a description of the image for screen readers" },
                        { id: "a2", text: "To improve SEO rankings" },
                        { id: "a3", text: "To add a caption to the image" },
                    ],
                    correctOptionId: "a1",
                    furtherExplanation: "Alt text is used to describe images for users who rely on screen readers, ensuring they can understand the content of the image.",
                    topic: "Accessibility Basics",
                    link: ["https://www.w3.org/WAI/tutorials/images/decision-tree/"]
                },
            ],
            link: ["app/quiz/3"]
        },
        {
            id: "challenge-3",
            title: "Contrast Challenge",
            subtitle: "Ensure your webpage has sufficient color contrast",
            description: "Create a webpage with a header, a main content area, and a footer. Ensure that all text has sufficient contrast against its background.",
            starterCode: "",
            solutionCode: "",
            link: ["/app/challenges/contrast"]
        }
    ]
}