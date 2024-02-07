/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["../BlazeKit.Website.Islands/**/*.razor","Index.razor","Routes/**/*.{html,razor,md}", "Components/**/*.{html,razor,md}","Islands/**/*.{html,razor,md}"],
    theme: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography')
    ],
}
