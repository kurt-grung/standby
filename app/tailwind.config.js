/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './components/**/*.{js,jsx,ts,tsx}', './widgets/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        night: {
          bg: '#000000',
          surface: '#111111',
          card: '#161616',
          border: '#2A2A2C',
          primary: '#F5F5F7',
          secondary: '#8E8E93',
          muted: '#636366',
          red: '#FF453A',
          orange: '#FF9F0A',
          green: '#30D158',
          track: '#1F1F1F',
        },
        ultra: {
          bg: '#000000',
          primary: '#FFFFFF',
          secondary: '#8E8E93',
          accent: '#FF9F0A',
          green: '#30D158',
          track: '#2C2C2E',
        },
      },
      letterSpacing: {
        ultra: '0.2em',
      },
    },
  },
  plugins: [],
};
