/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["Index.razor","Routes/**/*.{html,razor,md}", "Components/**/*.{html,razor,md}","Islands/**/*.{html,razor,md}"],
    theme: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography')
    ],
}
