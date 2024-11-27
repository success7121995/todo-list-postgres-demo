import {nextui} from '@nextui-org/theme';
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/(button|dropdown|input|modal|select|ripple|spinner|menu|divider|popover|listbox|scroll-shadow).js"
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        darkText: "var(--dark-text)",
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
      },
      fontSize: {
        '1xs': ['0.5rem', {
          lineHeight: '1rem'
        }]
      }
    },
  },
  plugins: [nextui()],
} satisfies Config;
