/// <reference types="vitest" />
/// <reference types="vite/client" />

import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
		dedupe: ['@radix-ui/react-dismissable-layer'],
	},
	server: {
		host: true,
	},
	test: {
		globals: true,
		environment: 'jsdom',
	},
	build: {
		outDir: 'dist',
	},
})
