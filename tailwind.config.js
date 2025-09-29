/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2B82F6',
        'primary-hover': '#1E6FE0',
        secondary: '#34D399',
        'secondary-hover': '#22C37B',
        foreground: '#1E293B',
        'muted-foreground': '#64748B',
        background: '#F9FAFB',
        card: '#FFFFFF',
        border: '#E5E7EB',
        input: '#F3F4F6',
      },
    },
  },
  plugins: [],
}
