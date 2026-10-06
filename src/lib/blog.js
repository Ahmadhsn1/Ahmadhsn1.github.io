import {projects} from '@/content/projects.js'

export const formatDate = (day) => new Date(`${day}T00:00:00Z`).toLocaleDateString('en-GB', {day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'})

export const headingId = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

const blockWords = (block) => (block.type === 'code' ? 0 : (block.text ?? (block.items ?? []).join(' ')).split(/\s+/).length)

// About 210 words a minute for prose, plus a little for code, never less than one minute.
export function readingMinutes(post) {
	const words = post.sections.reduce((sum, section) => sum + section.blocks.reduce((total, block) => total + blockWords(block), 0), 0)
	const codeBlocks = post.sections.reduce((sum, section) => sum + section.blocks.filter((block) => block.type === 'code').length, 0)
	return Math.max(1, Math.round(words / 210 + codeBlocks * 0.4))
}

export const accentFor = (post) => projects.find((project) => project.slug === post.project)?.accent ?? '#ff6a3d'

// Posts that share the most tags with this one first, then the newest.
export function relatedPosts(post, all, count = 2) {
	return all
		.filter((item) => item.slug !== post.slug)
		.map((item) => ({item, score: item.tags.filter((tag) => post.tags.includes(tag)).length}))
		.sort((a, b) => b.score - a.score || b.item.published.localeCompare(a.item.published))
		.slice(0, count)
		.map((entry) => entry.item)
}
