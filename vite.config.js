import react from '@vitejs/plugin-react'
import {fileURLToPath, URL} from 'node:url'
import {defineConfig} from 'vite'

// Posts dated in the future stay hidden until a build runs after their publish time. The daily scheduled deploy
// (see .github/workflows/deploy.yml) is what makes them appear. BUILD_TIME previews another moment, for example
// BUILD_TIME=2026-10-10T10:00:00+05:00 npm run build
const buildTime = process.env.BUILD_TIME ? Date.parse(process.env.BUILD_TIME) : Date.now()
if (Number.isNaN(buildTime)) throw new Error(`BUILD_TIME is not a valid date: ${process.env.BUILD_TIME}`)

export default defineConfig({
	plugins: [react()],
	define: {__BUILD_TIME__: JSON.stringify(buildTime)},
	resolve: {
		alias: {'@': fileURLToPath(new URL('./src', import.meta.url))},
	},
	build: {
		target: 'es2022',
		sourcemap: false,
	},
})
