// Runs after the client and server builds. Turns the single-page app into real static pages:
// every route gets its own HTML (content, title, description, canonical, share image and
// structured data), plus sitemap.xml, robots.txt, llms.txt, 404.html and CNAME.
import {execFileSync} from 'node:child_process'
import {mkdir, readdir, readFile, writeFile} from 'node:fs/promises'
import {dirname, join} from 'node:path'
import {fileURLToPath, pathToFileURL} from 'node:url'

const escapeAttr = (value) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const escapeText = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const server = await import(pathToFileURL(join(root, 'dist-ssr', 'entry-server.js')).href)
const {renderPage, routes, pageMeta, schemaFor, absoluteUrl, site, projects, services, faq, livePosts} = server

// The last day the site's code or content changed, not the build day, so sitemap lastmod and dateModified
// only move when the site does (search engines ignore a lastmod that changes on every deploy).
function lastChanged() {
	try {
		const day = execFileSync('git', ['log', '-1', '--format=%cs', '--', 'src', 'public', 'index.html'], {cwd: root, encoding: 'utf8'}).trim()
		if (/^\d{4}-\d{2}-\d{2}$/.test(day)) return day
	} catch {
		// Not a git checkout: fall back to today.
	}
	return new Date().toISOString().slice(0, 10)
}
const builtOn = lastChanged()

// Core Web Vitals: inline the stylesheet so first paint is not waiting on a second request, and start
// fetching the two fonts the hero uses straight from the HTML instead of after the CSS is parsed.
const assets = await readdir(join(dist, 'assets'))
const fontPreloads = [/^geist-latin-wght-normal-.+\.woff2$/, /^instrument-serif-latin-400-italic-.+\.woff2$/]
	.map((pattern) => assets.find((file) => pattern.test(file)))
	.filter(Boolean)
	.map((file) => `<link rel="preload" as="font" type="font/woff2" href="/assets/${file}" crossorigin />`)
	.join('\n  ')

let template = await readFile(join(dist, 'index.html'), 'utf8')
const posts = livePosts()
if (posts.length) template = template.replace('</head>', () => `<link rel="alternate" type="application/rss+xml" title="${escapeAttr(`${site.name}: writing`)}" href="/rss.xml" />\n</head>`)
const stylesheetTag = template.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/)
if (!stylesheetTag) throw new Error('prerender: built template has no stylesheet link')
const css = await readFile(join(dist, stylesheetTag[1]), 'utf8')
template = template.replace(stylesheetTag[0], () => `${fontPreloads}\n  <style>${css.replaceAll('</style', '<\\/style')}</style>`)


function swap(html, pattern, replacement) {
	if (!pattern.test(html)) throw new Error(`prerender: template is missing ${pattern}`)
	return html.replace(pattern, () => replacement)
}

const metaTag = (attr, name) => new RegExp(`<meta ${attr}="${name}"\\s+content="[^"]*"\\s*/?>`)

function withHead(html, meta, schema) {
	const image = absoluteUrl(meta.image)
	const url = absoluteUrl(meta.path)
	let out = html
	out = swap(out, /<title>[^<]*<\/title>/, `<title>${escapeText(meta.title)}</title>`)
	out = swap(out, metaTag('name', 'description'), `<meta name="description" content="${escapeAttr(meta.description)}" />`)
	out = swap(out, /<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${url}" />`)
	out = swap(out, metaTag('property', 'og:url'), `<meta property="og:url" content="${url}" />`)
	out = swap(out, metaTag('property', 'og:title'), `<meta property="og:title" content="${escapeAttr(meta.title)}" />`)
	out = swap(out, metaTag('property', 'og:description'), `<meta property="og:description" content="${escapeAttr(meta.description)}" />`)
	out = swap(out, metaTag('property', 'og:image'), `<meta property="og:image" content="${image}" />`)
	out = swap(out, metaTag('property', 'og:image:alt'), `<meta property="og:image:alt" content="${escapeAttr(meta.imageAlt)}" />`)
	out = swap(out, metaTag('name', 'twitter:title'), `<meta name="twitter:title" content="${escapeAttr(meta.title)}" />`)
	out = swap(out, metaTag('name', 'twitter:description'), `<meta name="twitter:description" content="${escapeAttr(meta.description)}" />`)
	out = swap(out, metaTag('name', 'twitter:image'), `<meta name="twitter:image" content="${image}" />`)
	// "</" inside JSON must not close the script tag.
	out = swap(out, /<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`)
	return out
}

async function write(file, content) {
	const target = join(dist, file)
	await mkdir(dirname(target), {recursive: true})
	await writeFile(target, content)
}

// ── pages ───────────────────────────────────────────────────────────────
for (const route of routes()) {
	const meta = pageMeta(route.slug)
	const body = await renderPage(route.path)
	const html = withHead(template, meta, schemaFor(route.slug, builtOn)).replace('<div id="root"></div>', () => `<div id="root">${body}</div>`)
	await write(route.path === '/' ? 'index.html' : join(route.path, 'index.html'), html)
}

// Unknown URLs load the app shell, and are kept out of search results.
await write('404.html', swap(template, /<meta name="robots" content="[^"]*"\s*\/?>/, '<meta name="robots" content="noindex" />').replace(/<title>[^<]*<\/title>/, '<title>Page not found | Ahmad Hassan</title>'))

// ── crawler files ───────────────────────────────────────────────────────
const urls = routes().map((route) => `\t<url>\n\t\t<loc>${absoluteUrl(route.path)}</loc>\n\t\t<lastmod>${route.lastmod ?? builtOn}</lastmod>\n\t</url>`)
await write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`)
if (posts.length) {
	const items = posts.map(
		(post) =>
			`\t<item>\n\t\t<title>${escapeText(post.title)}</title>\n\t\t<link>${absoluteUrl(`/blog/${post.slug}/`)}</link>\n\t\t<guid isPermaLink="true">${absoluteUrl(`/blog/${post.slug}/`)}</guid>\n\t\t<pubDate>${new Date(`${post.published}T00:00:00Z`).toUTCString()}</pubDate>\n\t\t<description>${escapeText(post.description)}</description>\n\t</item>`
	)
	await write(
		'rss.xml',
		`<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n<channel>\n\t<title>${escapeText(site.name)}: writing</title>\n\t<link>${absoluteUrl('/blog/')}</link>\n\t<description>Technical write-ups on AI engineering by ${escapeText(site.name)}.</description>\n${items.join('\n')}\n</channel>\n</rss>\n`
	)
}
await write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl('/sitemap.xml')}\n`)

const projectLines = projects.map((project) => `- [${project.name}](${absoluteUrl(`/work/${project.slug}/`)}): ${project.tagline} ${project.type}.`)
const llms = [
	`# ${site.name}`,
	'',
	`> ${site.headline}. Builds AI products, web applications and native Android apps end to end. GitHub: ${site.githubHandle}.`,
	'',
	'## About',
	...faq.slice(0, 3).map((entry) => `- ${entry.question} ${entry.answer}`),
	'',
	'## Services',
	...services.map((service) => `- ${service.title}: ${service.text}`),
	'',
	'## Projects',
	...projectLines,
	'',
	...(posts.length ? ['## Writing', ...posts.map((post) => `- [${post.title}](${absoluteUrl(`/blog/${post.slug}/`)}): ${post.description}`), ''] : []),
	'## Links',
	`- [Portfolio](${absoluteUrl('/')})`,
	`- [GitHub](${site.github})`,
	`- [LinkedIn](${site.linkedin})`,
	`- Email: ${site.email}`,
	'',
].join('\n')
await write('llms.txt', llms)

const host = new URL(site.url).hostname
if (!host.endsWith('github.io')) await write('CNAME', `${host}\n`)

console.log(`prerendered ${routes().length} pages, sitemap.xml, robots.txt, llms.txt, 404.html`)
