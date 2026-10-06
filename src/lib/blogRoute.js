import {livePosts} from '@/content/posts.js'

// Blog pages have real URLs (/blog/ and /blog/<slug>/) and are prerendered one by one.
// A page key identifies them for meta and structured data: 'blog' or 'blog:<slug>'.
export function blogRouteFor(path) {
	const match = path.match(/^\/blog\/(?:([^/]+)\/?)?$/)
	if (!match) return null
	if (!match[1]) return livePosts().length ? {key: 'blog', post: null} : null
	const post = livePosts().find((item) => item.slug === decodeURIComponent(match[1]))
	return post ? {key: `blog:${post.slug}`, post} : null
}

export const isBlogKey = (key) => typeof key === 'string' && (key === 'blog' || key.startsWith('blog:'))
export const postFromKey = (key) => (isBlogKey(key) && key !== 'blog' ? livePosts().find((item) => item.slug === key.slice(5)) : undefined)
