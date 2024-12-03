/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        jaro: ['Jaro', 'sans-serif'],  
      },
      animation: {
        typing: 'typing 2s steps(25)',
      },
      keyframes: {
        typing: {
          '0%': { width: '0' },
          '100%': { width: '25ch' }, 
        },
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
};

