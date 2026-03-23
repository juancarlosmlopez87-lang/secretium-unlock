import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: { 50: "#eef9ff", 100: "#d8f1ff", 200: "#b9e7ff", 300: "#89d9ff", 400: "#51c2ff", 500: "#2aa3ff", 600: "#1484f5", 700: "#0d6ce1", 800: "#1157b6", 900: "#144a8f" },
        dark: { 800: "#1a1a2e", 900: "#0f0f1a", 950: "#080812" },
        success: "#00d26a",
        warning: "#ffc107",
        danger: "#ff4757",
      },
    },
  },
  plugins: [],
};
export default config;
