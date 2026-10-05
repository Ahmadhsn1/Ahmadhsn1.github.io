import {projects} from '@/content/projects.js'
import {site} from '@/content/site.js'

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

// Title, description and share image for a page. Used for both the prerendered HTML and in-page navigation.
export function pageMeta(slug) {
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

export const routes = () => [{path: '/', slug: null}, ...projects.map((project) => ({path: `/work/${project.slug}/`, slug: project.slug}))]
