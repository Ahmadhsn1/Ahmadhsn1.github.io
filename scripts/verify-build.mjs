// Post-build gate for CI. `vite build` can succeed while the prerendered pages are broken, so this
// checks what actually ships: every sitemap URL has a real page with its SEO tags and valid
// structured data, the crawler files exist, and every local asset a page references is in dist.
import {access, readFile} from 'node:fs/promises'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const failures = []
const fail = (message) => failures.push(message)
const warnings = []
const warn = (message) => warnings.push(message)

const exists = (path) =>
	access(path).then(
		() => true,
		() => false,
	)

const read = (path) => readFile(join(dist, path), 'utf8')

for (const file of ['index.html', '404.html', 'sitemap.xml', 'robots.txt', 'llms.txt']) {
	if (!(await exists(join(dist, file)))) fail(`missing ${file}`)
}

const sitemap = await read('sitemap.xml').catch(() => '')
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
if (urls.length < 2) fail(`sitemap lists ${urls.length} URLs, expected the home page and case studies`)

const assetPattern = /(?:src|href)="(\/[^"#?]+\.[a-z0-9]+)"/gi

for (const url of urls) {
	const path = new URL(url).pathname.replace(/^\/|\/$/g, '')
	const file = path ? `${path}/index.html` : 'index.html'
	const html = await read(file).catch(() => null)
	if (html === null) {
		fail(`${url}: no prerendered ${file}`)
		continue
	}

	if (!/<title>[^<]{10,}<\/title>/.test(html)) fail(`${file}: missing or short <title>`)
	if (!/<meta name="description" content="[^"]{50,}"/.test(html)) fail(`${file}: missing or short meta description`)
	if (!new RegExp(`<link rel="canonical" href="${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`).test(html)) fail(`${file}: canonical does not match sitemap URL`)
	if (!/<meta property="og:image" content="https:\/\//.test(html)) fail(`${file}: missing absolute og:image`)
	const h1Count = (html.match(/<h1[\s>]/g) ?? []).length
	if (h1Count > 1) fail(`${file}: ${h1Count} <h1> elements, expected one`)
	if (h1Count === 0) (path ? warn : fail)(`${file}: no <h1>`)
	if (/\bundefined\b|\[object Object\]/.test(html)) fail(`${file}: contains "undefined" or "[object Object]"`)

	const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
	if (blocks.length === 0) fail(`${file}: no structured data`)
	for (const [, json] of blocks) {
		try {
			JSON.parse(json)
		} catch {
			fail(`${file}: invalid JSON-LD`)
		}
	}

	for (const [, asset] of html.matchAll(assetPattern)) {
		if (!(await exists(join(dist, asset)))) fail(`${file}: references ${asset}, which is not in dist`)
	}
}

for (const line of warnings) console.warn(`warning: ${line}`)

if (failures.length) {
	console.error(`Build verification failed (${failures.length}):\n${failures.map((line) => `  - ${line}`).join('\n')}`)
	process.exit(1)
}
console.log(`Build verified: ${urls.length} pages, SEO tags, structured data and assets all present.`)
