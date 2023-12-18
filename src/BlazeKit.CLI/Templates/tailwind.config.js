/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["Routes/**/*.{html,razor,md}"],
    theme: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography')
    ],
}
