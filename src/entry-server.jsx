import {prerender} from 'react-dom/static'
import App from '@/app/App.jsx'
import {setServerPath} from '@/hooks/useCaseRoute.js'

async function readAll(stream) {
	const decoder = new TextDecoder()
	let html = ''
	for await (const chunk of stream) html += decoder.decode(chunk, {stream: true})
	return html + decoder.decode()
}

// Renders one page of the site to a static HTML string (used by scripts/prerender.mjs at build time).
export async function renderPage(path) {
	setServerPath(path)
	const {prelude} = await prerender(<App />)
	return readAll(prelude)
}

export {faq} from '@/content/faq.js'
export {projects} from '@/content/projects.js'
export {services} from '@/content/services.js'
export {site} from '@/content/site.js'
export {absoluteUrl, pageMeta, routes} from '@/seo/meta.js'
export {schemaFor} from '@/seo/schema.js'
