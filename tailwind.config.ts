import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard Variable', 'Pretendard', 'sans-serif'],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        brand: {
          primary: "hsl(var(--metal-start))", // metal-start를 프라이머리로 매핑
          secondary: "hsl(var(--brand-secondary))",
        },
        accent: {
          DEFAULT: "hsl(var(--brand-secondary))",
          foreground: "hsl(var(--background))",
        },
      },
    },
  },
  plugins: [],
};
export default config;