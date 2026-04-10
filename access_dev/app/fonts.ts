import { JetBrains_Mono, Major_Mono_Display } from "next/font/google";

export const jbMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jb-mono",
});

export const majorMonoDisplay = Major_Mono_Display({
  subsets: ["latin"],
  variable: "--font-major-mono-display",
  weight: ["400"],
});
