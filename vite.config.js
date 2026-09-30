import react from '@vitejs/plugin-react'
import {copyFileSync} from 'node:fs'
import {join} from 'node:path'
import {fileURLToPath, URL} from 'node:url'
import {defineConfig, loadEnv} from 'vite'

// Emits the static files a production host needs, all derived from VITE_SITE_URL.
function siteFiles(siteUrl) {
	const url = new URL(siteUrl)
	return {
		name: 'site-files',
		apply: 'build',
		generateBundle() {
			const today = new Date().toISOString().slice(0, 10)
			this.emitFile({type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n\nSitemap: ${url.origin}/sitemap.xml\n`})
			this.emitFile({
				type: 'asset',
				fileName: 'sitemap.xml',
				source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\t<url>\n\t\t<loc>${url.origin}/</loc>\n\t\t<lastmod>${today}</lastmod>\n\t</url>\n</urlset>\n`,
			})
			if (!url.hostname.endsWith('github.io')) this.emitFile({type: 'asset', fileName: 'CNAME', source: `${url.hostname}\n`})
		},
		// Unknown paths load the app instead of GitHub's default 404 page.
		writeBundle({dir}) {
			copyFileSync(join(dir, 'index.html'), join(dir, '404.html'))
		},
	}
}

export default defineConfig(({mode}) => {
	const env = loadEnv(mode, process.cwd(), 'VITE_')
	return {
		plugins: [react(), siteFiles(env.VITE_SITE_URL)],
		resolve: {
			alias: {'@': fileURLToPath(new URL('./src', import.meta.url))},
		},
		build: {
			target: 'es2022',
			sourcemap: false,
		},
	}
})
