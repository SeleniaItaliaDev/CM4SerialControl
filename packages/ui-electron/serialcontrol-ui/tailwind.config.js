/** @type {import('tailwindcss').Config} */
// need to import with import instead of require for ESM

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {},
    },
    plugins: [import("tailwindcss-animate")],
}