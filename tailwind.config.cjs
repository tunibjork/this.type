/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	daisyui: {
		themes: [
			{
				mytheme: {
					primary: '#e5c17bff',
					secondary: '#61afefff',
					accent: '#c678deff',
					neutral: '#abb2bf',
					'base-100': '#272c35',
					info: '#7f848e',
					success: '#97c379ff',
					warning: '#d19a66ff',
					error: '#e06c75ff'
				}
			}
		]
	},
	plugins: [require('daisyui')]
};
