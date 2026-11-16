import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: "#7C3AED",
          blue: "#3B82F6",
          pink: "#EC4899",
        },
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.05)",
        float: "0 16px 40px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};
export default config;