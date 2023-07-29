/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "gray-192": "#C0C0C0",
        "gray-195": "rgb(195,195,195)",
        "gray-222": "rgb(222,222,222)",
        "gray-250": "#FAFAFA",
        "gray-90": "#5A5A5A",
      },
    },
  },
  plugins: [],
};
