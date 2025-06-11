import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    heroui({
      layout: {
        dividerWeight: "1px", 
        disabledOpacity: 0.45, 
        fontSize: {
          tiny: "0.75rem",   // 12px
          small: "0.875rem", // 14px
          medium: "0.9375rem", // 15px
          large: "1.125rem", // 18px
        },
        lineHeight: {
          tiny: "1rem", 
          small: "1.25rem", 
          medium: "1.5rem", 
          large: "1.75rem", 
        },
        radius: {
          small: "8px", 
          medium: "12px", 
          large: "16px", 
        },
        borderWidth: {
          small: "1px", 
          medium: "1px", 
          large: "2px", 
        },
      },
      themes: {
        light: {
          colors: {
            // Rich purple-blue as primary (inspired by traditional Sizang textiles)
            primary: {
              50: "#f0f1fe",
              100: "#e4e5fd",
              200: "#cfd1fb",
              300: "#b4b7f9",
              400: "#9a9df6",
              500: "#7f83f4",
              600: "#5a5eef",
              700: "#4945e5", // Main primary color
              800: "#3730a3",
              900: "#312e81",
              DEFAULT: "#4945e5",
              foreground: "#ffffff"
            },
            // Complementary color (warm red-orange accent)
            secondary: {
              50: "#fff1f0",
              100: "#ffe4e1",
              200: "#ffccc7",
              300: "#ffada5",
              400: "#ff8a7e",
              500: "#ff5b4a", // Main secondary color
              600: "#e83a28",
              700: "#cc2a1a",
              800: "#a62616",
              900: "#8a2517",
              DEFAULT: "#ff5b4a",
              foreground: "#ffffff"
            }
          }
        }
      }
    })
  ]
}