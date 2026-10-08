// Generates the 1200x630 share cards: the home page, one per case study (with a real screenshot) and one per
// blog post (title, tags and a code excerpt). Run `npm run og` after changing a title, a metric or a post, then
// commit the images in public/og/. They are plain JPEGs, so the build and the deploy do not depend on this script.
import {existsSync, readdirSync} from 'node:fs'
import {mkdir, readFile, writeFile} from 'node:fs/promises'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {Resvg} from '@resvg/resvg-js'
import satori from 'satori'
import sharp from 'sharp'
import {createServer} from 'vite'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'og')
await mkdir(outDir, {recursive: true})

// Content is plain ES modules that use the "@/" alias, so let Vite load them.
const vite = await createServer({root, server: {middlewareMode: true}, appType: 'custom', logLevel: 'silent'})
const {projects} = await vite.ssrLoadModule('/src/content/projects.js')
const {posts} = await vite.ssrLoadModule('/src/content/posts.js')
const {site} = await vite.ssrLoadModule('/src/content/site.js')
const {tokenize} = await vite.ssrLoadModule('/src/lib/tokenize.js')
const {readingMinutes, accentFor} = await vite.ssrLoadModule('/src/lib/blog.js')

const font = (pkg, file) => readFile(join(root, 'node_modules', pkg, 'files', file))
const fonts = [
	{name: 'Geist', data: await font('@fontsource/geist', 'geist-latin-400-normal.woff'), weight: 400, style: 'normal'},
	{name: 'Geist', data: await font('@fontsource/geist', 'geist-latin-500-normal.woff'), weight: 500, style: 'normal'},
	{name: 'Geist', data: await font('@fontsource/geist', 'geist-latin-600-normal.woff'), weight: 600, style: 'normal'},
	{name: 'Geist', data: await font('@fontsource/geist', 'geist-latin-700-normal.woff'), weight: 700, style: 'normal'},
	{name: 'Geist Mono', data: await font('@fontsource/geist-mono', 'geist-mono-latin-400-normal.woff'), weight: 400, style: 'normal'},
	{name: 'Geist Mono', data: await font('@fontsource/geist-mono', 'geist-mono-latin-500-normal.woff'), weight: 500, style: 'normal'},
	{name: 'Instrument Serif', data: await font('@fontsource/instrument-serif', 'instrument-serif-latin-400-italic.woff'), weight: 400, style: 'italic'},
]

// ── tiny element helpers (satori takes plain objects) ─────────────────────
const el = (type, style, ...children) => ({type, props: {style: {display: 'flex', ...style}, children: children.flat().filter((child) => child !== null && child !== undefined && child !== false)}})
const div = (style, ...children) => el('div', style, ...children)
const text = (style, value) => ({type: 'div', props: {style: {display: 'flex', ...style}, children: String(value)}})
const img = (src, style = {}) => ({type: 'img', props: {src, style}})
const mono = {fontFamily: 'Geist Mono'}

const dataUri = (buffer, type) => `data:${type};base64,${buffer.toString('base64')}`

// ── shared pieces ─────────────────────────────────────────────────────────
const markSvg = (size) =>
	`data:image/svg+xml;utf8,${encodeURIComponent(
		`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 36 36"><rect x=".75" y=".75" width="34.5" height="34.5" rx="10.5" fill="#131316" stroke="#3a3a3f" stroke-width="1.5"/><g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"><path d="M6.4 26.4 12.2 9.6 18 26.4" stroke="#f2efe8"/><path d="M22 9.6v16.8M29.6 9.6v16.8" stroke="#f2efe8"/><path d="M9 19.8h20.6" stroke="#ff6a3d"/></g></svg>`
	)}`

const character = await sharp(join(root, 'public/images/hero/ahmad-3d.webp')).png().toBuffer()
const avatar = dataUri(await sharp(character).extract({left: 70, top: 0, width: 380, height: 380}).resize(120, 120).png().toBuffer(), 'image/png')
const characterTop = dataUri(await sharp(character).resize({width: 470}).png().toBuffer(), 'image/png')

const background = (accent, glow = {}) =>
	div(
		{position: 'absolute', top: 0, left: 0, width: 1200, height: 630, backgroundColor: '#09090b', overflow: 'hidden'},
		div({
			position: 'absolute',
			top: 0,
			left: 0,
			width: 1200,
			height: 630,
			backgroundImage: 'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)',
			backgroundSize: '60px 60px',
		}),
		div({
			position: 'absolute',
			top: glow.top ?? -220,
			left: glow.left ?? 520,
			width: 1000,
			height: 1000,
			backgroundImage: `radial-gradient(circle, ${accent}66 0%, ${accent}00 62%)`,
		})
	)

const lockup = (subtitle) =>
	div(
		{alignItems: 'center', gap: 16},
		img(markSvg(60), {width: 60, height: 60}),
		div({flexDirection: 'column', gap: 4}, text({fontSize: 26, fontWeight: 600, color: '#f2efe8'}, site.name), text({fontSize: 18, color: '#9a968d', ...mono}, subtitle))
	)

const frame = (children) => div({position: 'relative', width: 1200, height: 630}, ...children)

// ── pages ─────────────────────────────────────────────────────────────────
const home = () => {
	const stats = [
		['11', 'products'],
		['1,685', 'tests'],
		['10k+', 'families'],
	]
	return frame([
		background('#ff6a3d', {left: 560, top: -150}),
		div({position: 'absolute', right: 20, bottom: 0, width: 470, height: 630, overflow: 'hidden'}, img(characterTop, {width: 470, marginTop: 10})),
		div({position: 'absolute', right: 0, bottom: 0, width: 520, height: 140, backgroundImage: 'linear-gradient(to top, #09090b, rgba(9,9,11,0))'}),
		div(
			{position: 'absolute', top: 64, left: 72, width: 700, height: 502, flexDirection: 'column', justifyContent: 'space-between'},
			lockup(`${site.role} · ${site.city}`),
			div(
				{flexDirection: 'column', gap: 0},
				text({fontSize: 78, fontWeight: 600, color: '#f2efe8', lineHeight: 1.04, letterSpacing: -2.5}, 'I build AI products'),
				text({fontSize: 78, fontWeight: 600, color: '#f2efe8', lineHeight: 1.04, letterSpacing: -2.5}, 'that survive'),
				text({fontSize: 96, fontFamily: 'Instrument Serif', fontStyle: 'italic', color: '#ff6a3d', lineHeight: 1.0}, 'real users.')
			),
			div(
				{gap: 36, alignItems: 'center'},
				...stats.map(([value, label]) => div({flexDirection: 'column', gap: 2}, text({fontSize: 38, fontWeight: 600, color: '#ff6a3d'}, value), text({fontSize: 17, color: '#9a968d', ...mono}, label))),
				div({marginLeft: 8, paddingLeft: 36, borderLeft: '1px solid #2a2a2e', flexDirection: 'column', gap: 4}, text({fontSize: 19, color: '#cfcac0', ...mono}, 'RAG · Agents'), text({fontSize: 19, color: '#cfcac0', ...mono}, 'SaaS · Android'))
			)
		),
	])
}

async function shot(path, width = 1000) {
	if (!path) return null
	const base = path.replace(/\.(jpe?g|png)$/i, '')
	const candidates = [`${base}-1600.webp`, `${base}-800.webp`, path].map((candidate) => join(root, 'public', candidate))
	const file = candidates.find((candidate) => existsSync(candidate))
	if (!file) return null
	const buffer = await sharp(file).resize({width}).jpeg({quality: 82}).toBuffer()
	return dataUri(buffer, 'image/jpeg')
}

// Phone screens for share cards: public/images/projects/<slug>/og-phone-1.webp, og-phone-2.webp ... (left to right).
async function phoneShots(slug) {
	const dir = join(root, 'public', 'images', 'projects', slug)
	if (!existsSync(dir)) return []
	const files = readdirSync(dir).filter((file) => /^og-phone-\d+\.webp$/.test(file)).sort()
	return Promise.all(files.map(async (file) => dataUri(await sharp(join(dir, file)).resize({width: 380}).jpeg({quality: 86}).toBuffer(), 'image/jpeg')))
}

// A fan of phone screens, the middle one on top.
function phoneFan(shots, accent) {
	const count = shots.length
	const width = 190
	const height = 338
	const step = (520 - width) / (count - 1)
	const middle = (count - 1) / 2
	return shots
		.map((src, index) => ({src, index, distance: Math.abs(index - middle)}))
		.sort((a, b) => b.distance - a.distance)
		.map(({src, index, distance}) =>
			div(
				{position: 'absolute', top: 128 + distance * 26, left: 640 + index * step, width, height, borderRadius: 22, overflow: 'hidden', border: `1px solid ${distance === 0 ? accent : '#ffffff33'}`, boxShadow: '0 30px 70px rgba(0,0,0,0.7)', transform: `rotate(${(index - middle) * 5}deg)`},
				img(src, {width, height, objectFit: 'cover'})
			)
		)
}

const windowCard = (style, body) =>
	div(
		{position: 'absolute', flexDirection: 'column', overflow: 'hidden', borderRadius: 20, border: '1px solid #3a3a3f', backgroundColor: '#101013', boxShadow: '0 40px 90px rgba(0,0,0,0.65)', ...style},
		div({height: 38, alignItems: 'center', gap: 8, paddingLeft: 16, backgroundColor: '#17171a', borderBottom: '1px solid #26262a'}, ...['#ff5f57', '#febc2e', '#28c840'].map((color) => div({width: 11, height: 11, borderRadius: 6, backgroundColor: color}))),
		body
	)

async function projectCard(project) {
	const [main, second] = await Promise.all([project.cover?.art ? null : shot(project.cover), shot(project.gallery?.[1]?.src ?? project.gallery?.[0]?.src ?? '', 800)])
	const accent = project.accent
	// Geist has no star glyph, so a rating reads "4.9" over "Google Play rating".
	const metrics = project.metrics.slice(0, 3).map((metric) => (metric.value.includes('★') ? {value: metric.value.replace('★', ''), label: `${metric.label} rating`} : metric))
	const points = project.engineering.slice(0, 3).map((item) => item.title)
	const phones = await phoneShots(project.slug)
	const visual = []
	if (phones.length >= 3) visual.push(...phoneFan(phones, accent))
	else if (second && main)
		visual.push(windowCard({top: 120, left: 690, width: 440, height: 300, transform: 'rotate(5deg)', opacity: 0.55}, img(second, {width: 440, height: 262, objectFit: 'cover', objectPosition: 'top left'})))
	if (phones.length < 3)
		visual.push(
		main
			? windowCard({top: 150, left: 640, width: 500, height: 330, transform: 'rotate(-3deg)'}, img(main, {width: 500, height: 292, objectFit: 'cover', objectPosition: 'top left'}))
			: windowCard(
					{top: 130, left: 650, width: 480, height: 360, transform: 'rotate(-3deg)'},
					div(
						{flexDirection: 'column', gap: 22, padding: 30},
						text({fontSize: 15, color: accent, textTransform: 'uppercase', letterSpacing: 2, ...mono}, 'Engineering decisions'),
						...points.map((point) => div({gap: 14, alignItems: 'flex-start'}, div({width: 10, height: 10, marginTop: 10, borderRadius: 2, backgroundColor: accent, flexShrink: 0}), text({fontSize: 25, fontWeight: 500, color: '#e6e2d9', lineHeight: 1.3}, point)))
					)
			  )
	)
	return frame([
		background(accent, {left: 520, top: -250}),
		...visual,
		div(
			{position: 'absolute', top: 64, left: 72, width: 560, height: 502, flexDirection: 'column', justifyContent: 'space-between'},
			lockup(`${site.role} · ${site.city}`),
			div(
				{flexDirection: 'column', gap: 14},
				text({fontSize: 18, color: accent, textTransform: 'uppercase', letterSpacing: 2.5, ...mono}, project.type),
				text({fontSize: project.name.length > 14 ? 74 : 92, fontWeight: 600, color: '#f2efe8', letterSpacing: -3, lineHeight: 1.0}, project.name),
				text({fontSize: 32, fontFamily: 'Instrument Serif', fontStyle: 'italic', color: '#bdb8ae', lineHeight: 1.2}, project.tagline.length > 62 ? `${project.tagline.slice(0, 60)}…` : project.tagline)
			),
			div({gap: 34}, ...metrics.map((metric) => div({flexDirection: 'column', gap: 2}, text({fontSize: 34, fontWeight: 600, color: '#f2efe8'}, metric.value), text({fontSize: 15, color: '#8a867e', ...mono}, metric.label))))
		),
	])
}

const colour = {keyword: '#ff8f6b', string: '#7dd3a8', number: '#ffc56e', comment: '#6f6c66', plain: '#d7d3ca'}

function codeLines(post) {
	for (const section of post.sections) {
		for (const block of section.blocks) {
			if (block.type !== 'code' || !['js', 'ts', 'sql', 'json'].includes(block.lang)) continue
			const lines = block.text.split('\n').filter((line, index, all) => line.trim() || (index > 0 && index < all.length - 1)).slice(0, 10)
			return {lang: block.lang, lines}
		}
	}
	return null
}

function codeCard(post, accent) {
	const code = codeLines(post)
	if (!code) return null
	const rows = code.lines.map((line) => {
		const clipped = line.length > 31 ? `${line.slice(0, 30)}…` : line
		const tokens = tokenize(clipped, code.lang)
		const span = (token) => ({type: 'span', props: {style: {color: colour[token.type] ?? colour.plain, whiteSpace: 'pre', fontStyle: token.type === 'comment' ? 'italic' : 'normal'}, children: token.text}})
		return div({height: 30, alignItems: 'center', whiteSpace: 'pre', fontSize: 21, overflow: 'hidden', ...mono}, ...(tokens.length ? tokens : [{type: 'plain', text: ' '}]).map(span))
	})
	return windowCard(
		{top: 150, left: 680, width: 470, height: 38 + 36 + code.lines.length * 30, transform: 'rotate(3deg)', borderColor: `${accent}88`},
		div({flexDirection: 'column', padding: '18px 22px'}, ...rows)
	)
}

const tagChip = (tag, accent) => div({padding: '7px 15px', borderRadius: 999, border: `1px solid ${accent}77`, backgroundColor: `${accent}1f`, color: '#f2efe8', fontSize: 17, whiteSpace: 'nowrap', flexShrink: 0, ...mono}, tag)

// As many tags as fit on one line of the text column.
const fitTags = (tags, max = 42) => tags.reduce((kept, tag) => (kept.join('').length + tag.length <= max ? [...kept, tag] : kept), [])

function blogCard(post) {
	const accent = accentFor(post)
	const size = post.title.length <= 32 ? 76 : post.title.length <= 44 ? 66 : post.title.length <= 52 ? 62 : 56
	const card = codeCard(post, accent)
	const minutes = readingMinutes(post)
	const date = new Date(`${post.published}T00:00:00Z`).toLocaleDateString('en-GB', {day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'})
	return frame([
		background(accent, {left: 540, top: -240}),
		card ?? div({position: 'absolute', top: 150, left: 700, width: 420, flexDirection: 'column', gap: 16}, text({fontSize: 120, color: accent, fontFamily: 'Instrument Serif', fontStyle: 'italic', lineHeight: 0.8}, '“'), text({fontSize: 30, color: '#d7d3ca', lineHeight: 1.35}, post.answer.length > 150 ? `${post.answer.slice(0, 148)}…` : post.answer)),
		div(
			{position: 'absolute', top: 64, left: 72, width: card ? 600 : 640, height: 502, flexDirection: 'column', justifyContent: 'space-between'},
			div({alignItems: 'center', gap: 14}, text({fontSize: 18, color: accent, textTransform: 'uppercase', letterSpacing: 3, ...mono}, 'Engineering notes')),
			div({flexDirection: 'column', gap: 26}, div({gap: 10, flexWrap: 'wrap'}, ...fitTags(post.tags).map((tag) => tagChip(tag, accent))), text({fontSize: size, fontWeight: 600, color: '#f2efe8', letterSpacing: -2.5, lineHeight: 1.05}, post.title)),
			div(
				{alignItems: 'center', gap: 16},
				img(avatar, {width: 56, height: 56, borderRadius: 28, backgroundColor: '#1d2a44', border: `2px solid ${accent}`, objectFit: 'cover'}),
				div({flexDirection: 'column', gap: 2}, text({fontSize: 24, fontWeight: 600, color: '#f2efe8'}, site.name), text({fontSize: 17, color: '#8a867e', ...mono}, `${date} · ${minutes} min read`))
			)
		),
	])
}

// ── render ────────────────────────────────────────────────────────────────
async function render(name, tree) {
	const svg = await satori(tree, {width: 1200, height: 630, fonts})
	const png = new Resvg(svg, {fitTo: {mode: 'width', value: 1200}}).render().asPng()
	const jpeg = await sharp(png).jpeg({quality: 88, mozjpeg: true}).toBuffer()
	await writeFile(name, jpeg)
	console.log(`${name.replace(`${root}/`, '')}  ${(jpeg.length / 1024).toFixed(0)} kB`)
}

await render(join(root, 'public', 'og.jpg'), home())
for (const project of projects) await render(join(outDir, `${project.slug}.jpg`), await projectCard(project))
for (const post of posts) await render(join(outDir, `blog-${post.slug}.jpg`), blogCard(post))
await vite.close()
