import type { Config } from "tailwindcss";
import tailwindScrollbar from 'tailwind-scrollbar'

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    tailwindScrollbar({ nocompatible: true, preferredStrategy: 'pseudoelements' }),
  ],
};
export default config;
