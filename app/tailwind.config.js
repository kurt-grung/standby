/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './components/**/*.{js,jsx,ts,tsx}', './widgets/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        ultra: {
          bg: '#000000',
          primary: '#FFFFFF',
          secondary: '#8E8E93',
          accent: '#FF9F0A',
          green: '#30D158',
          track: '#2C2C2E',
        },
      },
    },
  },
  plugins: [],
};
