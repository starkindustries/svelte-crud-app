import { sveltekit } from '@sveltejs/kit/vite';
//import { defineConfig } from 'vite';
import { defineConfig } from 'vitest/config';

// https://svelte.dev/docs/svelte/testing
export default defineConfig({
	plugins: [sveltekit()],
	// Tell Vitest to use the `browser` entry points in `package.json` files, even though it's running in Node
	resolve: process.env.VITEST ? { conditions: ['browser'] } : undefined,
	test: {
		coverage: {
			exclude: [
				'svelte.config.js',
			]
		}
	}
});