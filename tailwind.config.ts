/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./resources/**/*.blade.php",
      "./resources/**/*.js",
      "./resources/**/*.tsx",
      "./resources/**/*.ts",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#f0f9ff',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
          },
          mental: {
            calm: '#e0f2fe',
            peace: '#7dd3fc',
            trust: '#0369a1',
          }
        }
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
      require('@headlessui/tailwindcss'),
    ],
  }