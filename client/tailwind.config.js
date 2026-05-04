export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
            DEFAULT: '#6366f1', // Indigo 500
            hover: '#4f46e5',   // Indigo 600
            light: '#e0e7ff',   // Indigo 100
        },
        secondary: {
            DEFAULT: '#10b981', // Emerald 500
            hover: '#059669',   // Emerald 600
            light: '#d1fae5',   // Emerald 100
        },
        dark: '#1e293b',      // Slate 800
        light: '#f8fafc',     // Slate 50
        surface: '#ffffff',
      }
    },
  },
  plugins: [],
}
