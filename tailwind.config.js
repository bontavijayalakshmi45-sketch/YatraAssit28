/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#FFF8F0',
          100: '#FFECD9',
          200: '#FFD4A8',
          300: '#FFB86C',
          400: '#FF9632',
          500: '#FF7A00',
          600: '#E65C00',
          700: '#CC4A00',
          800: '#A33C00',
          900: '#7A2E00',
        },
        teal: {
          50: '#E6F7F7',
          100: '#CCF0EF',
          200: '#99E1DF',
          300: '#66D2CF',
          400: '#33C3BF',
          500: '#00B4AF',
          600: '#009A96',
          700: '#007A77',
          800: '#005A58',
          900: '#003A39',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
