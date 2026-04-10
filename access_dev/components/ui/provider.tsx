"use client"

import {
  ChakraProvider,
  createSystem,
  defaultConfig,
  defineConfig,
} from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"

const system = createSystem(
  defaultConfig,
  defineConfig({
    theme: {
      tokens: {
        fonts: {
          body: { value: "var(--font-jb-mono)" },
          mono: { value: "var(--font-jb-mono)" },
          heading: { value: "var(--font-major-mono-display)" },
        },
      },
    },
  }),
)

export function Provider(props: ColorModeProviderProps) {
  const { children, ...rest } = props

  return (
    <ColorModeProvider {...rest}>
      <ChakraProvider value={system}>{children}</ChakraProvider>
    </ColorModeProvider>
  )
}
