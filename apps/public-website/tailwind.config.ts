import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/shared/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bvb: {
          yellow: '#FDE100',
          yellowHover: '#FFE600',
          black: '#000000',
          dark: '#0A0A0A',
          card: '#141414',
          border: '#262626',
        },
        warrior: {
          green: 'var(--warrior-green, #0A2E1C)',
          forest: 'var(--deep-forest-green, #071A10)',
          yellow: 'var(--crest-yellow, #FDE100)',
          gold: 'var(--golden-accent, #FFE600)',
          white: '#FFFFFF',
          surface: '#0A0A0A',
          grey: '#1F1F1F',
          charcoal: '#000000',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Barlow Condensed', 'Kanit', 'Chakra Petch', 'Oswald', 'sans-serif'],
        athletic: ['var(--font-heading)', 'Barlow Condensed', 'Kanit', 'Chakra Petch', 'Oswald', 'sans-serif'],
        pedals: ['var(--font-heading)', 'Barlow Condensed', 'Kanit', 'Chakra Petch', 'Oswald', 'sans-serif'],
        body: ['var(--font-body)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
