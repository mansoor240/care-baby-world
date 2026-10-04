/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FDFBF7",
        blush: { 50: "#FDF2F5", 100: "#FBE4EA", 200: "#F6C7D3", 300: "#EE9FB4", 400: "#E2708F", 500: "#D14D71" },
        sky: { 50: "#F0F6FB", 100: "#DEEEF7", 200: "#BFDDF0", 300: "#93C4E4", 400: "#5FA5D4", 500: "#3D86BD" },
        sage: { 50: "#F2F8F3", 100: "#E1EFE4", 200: "#C2DFC7", 300: "#97C79F", 400: "#66A971", 500: "#448C50" },
        lavender: { 50: "#F6F4FB", 100: "#EDE9F7", 200: "#DAD2EF", 300: "#BFB2E3", 400: "#9E8CD4", 500: "#7C68C0" },
        sand: { 50: "#FAF7F2", 100: "#F2EBDD", 200: "#E6D9BE", 300: "#D5BE92", 400: "#C0A268", 500: "#A6874A" },
        ink: { 900: "#1F1B24", 700: "#3B3543", 500: "#6B6470", 300: "#A8A2AF" },
      },
      borderRadius: { "3xl": "1.5rem", "4xl": "2rem" },
      boxShadow: {
        soft: "0 4px 24px -8px rgba(31,27,36,0.08)",
        card: "0 2px 12px -4px rgba(31,27,36,0.06)",
      },
    },
  },
  plugins: [],
};