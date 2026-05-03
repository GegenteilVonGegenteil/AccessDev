import type { Metadata } from "next";
import { jbMono, majorMonoDisplay } from "./fonts";
import "./globals.css";

import { Provider } from "@/components/ui/provider"

export const metadata: Metadata = {
  title: "AccessDev",
  description: "An educational tool using the power of simulation to teach developers the basics of web accessibility.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jbMono.variable} ${majorMonoDisplay.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className={`${jbMono.className} min-h-full flex flex-col`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
