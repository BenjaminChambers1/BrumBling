import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';

const config = {
	plugins: [sveltekit()],
	resolve: {
		alias: {
			'$components': path.resolve(__dirname, './src/components'),
			'$directives': path.resolve(__dirname, './src/directives'),
			// '$helpers': path.resolve(__dirname, './src/helpers'),
			'$http': path.resolve(__dirname, './src/http'),
			'$stores': path.resolve(__dirname, './src/stores')
		}
	}
};

export default config;

