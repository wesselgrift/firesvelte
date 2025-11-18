// Vite and SvelteKit plugins
import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// Configure Vite with Tailwind CSS, SvelteKit, and devtools plugins
export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), devtoolsJson()]
});