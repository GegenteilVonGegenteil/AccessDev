import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

// theme related stuff for chakra ui, namely colors
const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        primary: {
          50: { value: "rgb(250 245 255)" },
          100: { value: "rgb(243 233 254)" },
          200: { value: "rgb(233 214 254)" },
          300: { value: "rgb(216 182 252)" },
          400: { value: "rgb(183 119 248)" },
          500: { value: "rgb(167 89 243)" },
          600: { value: "rgb(146 56 229)" },
          700: { value: "rgb(125 39 201)" },
          800: { value: "rgb(106 37 164)" },
          900: { value: "rgb(87 31 132)" },
          950: { value: "rgb(37 7 63)" },
        },
        secondary: {
          50: { value: "rgb(254 242 255)" },
          100: { value: "rgb(252 227 255)" },
          200: { value: "rgb(251 199 255)" },
          300: { value: "rgb(253 154 255)" },
          400: { value: "rgb(254 95 255)" },
          500: { value: "rgb(254 35 255)" },
          600: { value: "rgb(246 3 242)" },
          700: { value: "rgb(205 0 197)" },
          800: { value: "rgb(167 1 159)" },
          900: { value: "rgb(147 8 137)" },
          950: { value: "rgb(56 1 52)" },
        },
        accent: {
          50: { value: "rgb(242 249 236)" },
          100: { value: "rgb(226 242 213)" },
          200: { value: "rgb(199 231 175)" },
          300: { value: "rgb(163 214 128)" },
          400: { value: "rgb(125 192 81)" },
          500: { value: "rgb(100 168 58)" },
          600: { value: "rgb(76 133 43)" },
          700: { value: "rgb(59 102 37)" },
          800: { value: "rgb(50 82 34)" },
          900: { value: "rgb(45 70 33)" },
          950: { value: "rgb(20 38 13)" },
        },
        text: {
          primary: { value: "#EFE6FA" },
          secondary: { value: "#d5cbe1" },
          disabled: { value: "#a195ae" },
        },
        background: { value: "#0F051B" }
      },
    },
  }
})

export const system = createSystem(defaultConfig, customConfig)