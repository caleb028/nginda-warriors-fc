import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/shared/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        warrior: {
          green: 'var(--warrior-green, #08783E)',
          forest: 'var(--deep-forest-green, #063B25)',
          yellow: 'var(--crest-yellow, #F5D000)',
          gold: 'var(--golden-accent, #D5AA00)',
          white: '#FFFFFF',
          surface: '#F8FAFC',
          grey: '#F1F5F9',
          charcoal: '#0F172A',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Al-Hilal Font', 'Pedals', 'Chakra Petch', 'Kanit', 'Barlow Condensed', 'sans-serif'],
        athletic: ['var(--font-heading)', 'Al-Hilal Font', 'Pedals', 'Chakra Petch', 'Kanit', 'Barlow Condensed', 'sans-serif'],
        pedals: ['var(--font-heading)', 'Al-Hilal Font', 'Pedals', 'Chakra Petch', 'Kanit', 'Barlow Condensed', 'sans-serif'],
        display: ['Al-Hilal Font', 'var(--font-heading)', 'sans-serif'],
        editorial: ['Al-Hilal Font', 'serif'],
        kicker: ['var(--font-kicker)', '"29LT Bukra Wide"', 'sans-serif'],
        wide: ['"29LT Bukra Wide"', 'sans-serif'],
        bukraWide: ['"29LT Bukra Wide"', 'sans-serif'],
        body: ['var(--font-body)', '"29LT Bukra"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        bukra: ['"29LT Bukra"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
