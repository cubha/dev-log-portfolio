import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Pretendard 폰트를 기본 sans-serif로 지정
      fontFamily: {
        sans: [
          'Pretendard Variable',
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // 브랜드 시맨틱 컬러 시스템
        // 사용 예: text-brand-primary, bg-brand-secondary
        // 그라데이션: from-brand-primary to-brand-secondary
        brand: {
          primary: '#2563EB',   // blue-600
          secondary: '#9333EA', // purple-600
        },
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        gradient: 'gradient 3s ease infinite',
      },
      backgroundSize: {
        'gradient-animate': '200% 200%',
      },
    },
  },
  plugins: [],
};
export default config;
