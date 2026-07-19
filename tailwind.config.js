/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e6eef5",
          100: "#cddceb",
          200: "#9cb9d6",
          300: "#6a96c2",
          400: "#3973ad",
          500: "#1a5276",
          600: "#15425e",
          700: "#103146",
          800: "#0a212f",
          900: "#051017",
        },
        accent: {
          50: "#fcf5e8",
          100: "#f9ebd1",
          200: "#f3d7a3",
          300: "#edc375",
          400: "#e7af47",
          500: "#d4923a",
          600: "#b87a2e",
          700: "#9c6322",
          800: "#804b16",
          900: "#64330a",
        },
        status: {
          critical: "#dc3545",
          high: "#fd7e14",
          medium: "#ffc107",
          low: "#28a745",
          closed: "#6c757d",
          investigating: "#17a2b8",
          open: "#007bff",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
