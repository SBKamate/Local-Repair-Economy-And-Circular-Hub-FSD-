/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#153B50',
          50: '#F0F5F8',
          100: '#D9E6ED',
          200: '#B0CBD9',
          500: '#153B50',
          600: '#112F40',
          700: '#0C2330',
          800: '#081720',
          900: '#040B10',
        },
        teal: {
          DEFAULT: '#16A085',
          50: '#E8F8F5',
          100: '#D1F2EB',
          200: '#A3E4D7',
          500: '#16A085',
          600: '#138D75',
          700: '#117A65',
          800: '#0E6655',
          900: '#0B5345',
        },
        surface: {
          bg: '#F5F7FA',
          card: '#FFFFFF',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(21, 59, 80, 0.08)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.05)',
        'hover': '0 10px 25px -5px rgba(21, 59, 80, 0.12), 0 8px 10px -6px rgba(21, 59, 80, 0.08)',
      }
    },
  },
  plugins: [],
}
