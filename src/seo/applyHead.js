import {absoluteUrl, pageMeta} from '@/seo/meta.js'

const setContent = (selector, value) => document.head.querySelector(selector)?.setAttribute('content', value)

// Keeps the document head in step with the page when the sheet opens and closes without a full reload.
export function applyHead(slug) {
	const meta = pageMeta(slug)
	const url = absoluteUrl(meta.path)
	document.title = meta.title
	setContent('meta[name="description"]', meta.description)
	document.head.querySelector('link[rel="canonical"]')?.setAttribute('href', url)
	setContent('meta[property="og:url"]', url)
	setContent('meta[property="og:title"]', meta.title)
	setContent('meta[property="og:description"]', meta.description)
	setContent('meta[property="og:image"]', absoluteUrl(meta.image))
	setContent('meta[property="og:image:alt"]', meta.imageAlt)
	setContent('meta[name="twitter:title"]', meta.title)
	setContent('meta[name="twitter:description"]', meta.description)
	setContent('meta[name="twitter:image"]', absoluteUrl(meta.image))
}
