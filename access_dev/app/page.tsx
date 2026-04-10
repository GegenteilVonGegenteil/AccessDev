import { Separator, Heading, Text, Button } from "@chakra-ui/react";
import { majorMonoDisplay } from "./fonts";
import { LuChevronRight } from "react-icons/lu";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-35"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1000 500"
      >
        <defs>
          <filter id="blob-blur" filterUnits="userSpaceOnUse" x="0" y="0" width="1000" height="500">
            <feGaussianBlur stdDeviation="100" />
          </filter>
          <filter id="grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="1"
              numOctaves="3"
              result="turbulence"
              stitchTiles="stitch"
            />
            <feBlend in="SourceGraphic" in2="turbulence" mode="overlay" />
          </filter>
        </defs>
        <g filter="url(#blob-blur)">
          <rect x="723.24" y="28.60" width="349.13" height="361.59" fill="#B777F8" />
          <rect x="428.50" y="-1.21" width="409.45" height="506.63" fill="#930889" />
          <rect x="173.70" y="288.68" width="507.64" height="406.04" fill="#7DC051" />
        </g>
        <rect
          x="0" y="0"
          width="1000" height="500"
          style={{ mixBlendMode: "luminosity", filter: "url(#grain)", opacity: 0.2 }}
        />
      </svg>
      <div className="w-full h-full flex flex-col gap-6 items-center z-1">
        <Heading as="h1" size="6xl" className={`${majorMonoDisplay.className} text-center`}>
          Access<span className="text-lavender-400">DEV</span>
        </Heading>
        <Separator size="lg" />
        <Text width={500} className="text-center">
          Beauty is in the eye of the beholder. Usability is in the experience of the user. Time to swap seats and learn how to build for everyone.
        </Text>
        <Button
          asChild
          gap="2"
          size="lg"
          bg="var(--color-lavender-400)"
          color="var(--color-lavender-950)"
          _hover={{ bg: "var(--color-lavender-500)" }}
          _active={{ bg: "var(--color-lavender-600)" }}
        >
          <a href="/app">
            Start Now
            <LuChevronRight aria-hidden="true" />
          </a>
        </Button>
      </div>

    </div>
  );
}
