import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        disableText: "var(--disable-text)",
        disable: "var(--disable)",
        danger: "var(--danger)",

        // Tags
        important: "var(--important)",
        life: "var(--life)",
        family: "var(--family)",
        work: "var(--work)",
        
      },
      fontFamily: {
        tangerine: "var(--font-tangerine-regular)",
        tangerineBold: "var(--font-tangerine-bold)",
        publicSans: "var(--font-public-sans)",
        publicSansItalic: "var(--font-public-sans-italic)",
      }
    },
  },
  plugins: [],
} satisfies Config;
