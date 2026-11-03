import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          900: '#14532d',
        },
        risk: {
          low: '#22c55e',
          moderate: '#f59e0b',
          high: '#ef4444',
        },
        surface: {
          base: '#0a0f0d',
          card: '#161f18',
          hover: '#1c2920',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'green-glow': 'radial-gradient(ellipse at center, rgba(34,197,94,0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'green-sm': '0 0 16px rgba(34,197,94,0.25)',
        'green-md': '0 0 30px rgba(34,197,94,0.35)',
        'green-lg': '0 0 50px rgba(34,197,94,0.45)',
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease forwards',
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;
