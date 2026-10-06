import {livePosts} from '@/content/posts.js'
import {projects} from '@/content/projects.js'
import {site} from '@/content/site.js'
import {isBlogKey, postFromKey} from '@/lib/blogRoute.js'

const DESCRIPTION_MAX = 155

// Trims at a word boundary so search snippets never end mid-word.
const clip = (text, max = DESCRIPTION_MAX) => {
	if (text.length <= max) return text
	const cut = text.slice(0, max - 1)
	return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:.\-–—]+$/, '')}…`
}

export const absoluteUrl = (path) => `${site.url}${path}`

const homeMeta = () => ({
	slug: null,
	path: '/',
	title: `${site.name} | ${site.role} in ${site.location}`,
	description: clip(`${site.name} (${site.githubHandle}): ${site.headline.charAt(0).toLowerCase()}${site.headline.slice(1)}. Builds AI products, web apps and Android apps. ${projects.length} shipped projects.`),
	image: '/og.jpg',
	imageAlt: `${site.name}, ${site.role} in ${site.city}. I build AI products that survive real users.`,
})

const blogMeta = (key) => {
	const post = postFromKey(key)
	if (!post) {
		return {
			slug: key,
			path: '/blog/',
			title: `Writing on AI Engineering | ${site.name}`,
			description: `Technical write-ups by ${site.name} on RAG, LLM products, NestJS and Android, drawn from shipped projects.`,
			image: '/og.jpg',
			imageAlt: `${site.name}, ${site.role} in ${site.city}`,
		}
	}
	return {
		slug: key,
		path: `/blog/${post.slug}/`,
		title: `${post.title} | ${site.name}`,
		description: clip(post.description),
		image: post.image ?? '/og.jpg',
		imageAlt: post.title,
	}
}

// Title, description and share image for a page. Used for both the prerendered HTML and in-page navigation.
// The key is a project slug, 'blog' or 'blog:<slug>'; anything else is the home page.
export function pageMeta(slug) {
	if (isBlogKey(slug)) return blogMeta(slug)
	const project = projects.find((item) => item.slug === slug)
	if (!project) return homeMeta()
	return {
		slug,
		path: `/work/${slug}/`,
		title: `${project.name}: ${project.type} | ${site.name}`,
		description: clip(`${project.tagline} ${project.summary}`),
		image: `/og/${slug}.jpg`,
		imageAlt: `${project.name}, ${project.type.toLowerCase()} by ${site.name}`,
	}
}

export const routes = () => [
	{path: '/', slug: null},
	...projects.map((project) => ({path: `/work/${project.slug}/`, slug: project.slug})),
	...(livePosts().length ? [{path: '/blog/', slug: 'blog', lastmod: livePosts()[0].updated}] : []),
	...livePosts().map((post) => ({path: `/blog/${post.slug}/`, slug: `blog:${post.slug}`, lastmod: post.updated})),
]
