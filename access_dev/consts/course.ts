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
            link: ["/quizzes/1"]
        },
        {
            id: "challenge-1",
            title: "Keyboard Navigation Challenge",
            subtitle: "Make a simple webpage navigable using only the keyboard",
            description: "Create a webpage with a header, a main content area, and a footer. Ensure that all interactive elements can be accessed and used with keyboard navigation.",
            starterCode: "",
            solutionCode: "",
            link: ["/challenges/1"]
        },
        {
            id: "quiz-2",
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
            link: ["/quizzes/1"]
        },
        {
            id: "challenge-2",
            title: "Keyboard Navigation Challenge",
            subtitle: "Make a simple webpage navigable using only the keyboard",
            description: "Create a webpage with a header, a main content area, and a footer. Ensure that all interactive elements can be accessed and used with keyboard navigation.",
            starterCode: "",
            solutionCode: "",
            link: ["/challenges/1"]
        },
        {
            id: "quiz-3",
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
            link: ["/quizzes/1"]
        },
        {
            id: "challenge-3",
            title: "Keyboard Navigation Challenge",
            subtitle: "Make a simple webpage navigable using only the keyboard",
            description: "Create a webpage with a header, a main content area, and a footer. Ensure that all interactive elements can be accessed and used with keyboard navigation.",
            starterCode: "",
            solutionCode: "",
            link: ["/challenges/1"]
        }
    ]
}