/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // Tailwind v4 ships as a dedicated PostCSS plugin and handles vendor
    // prefixing internally, so autoprefixer is no longer needed.
    "@tailwindcss/postcss": {},
  },
};

export default config;
