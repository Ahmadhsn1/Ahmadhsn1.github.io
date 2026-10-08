import {Fragment, useEffect, useState} from 'react'
import {BrandMark} from '@/components/BrandMark.jsx'
import {useToast} from '@/components/Toast.jsx'
import {livePosts} from '@/content/posts.js'
import {projects} from '@/content/projects.js'
import {site} from '@/content/site.js'
import {Code} from '@/features/blog/Code.jsx'
import {accentFor, formatDate, headingId, readingMinutes, relatedPosts} from '@/lib/blog.js'

// Inline text supports [label](/path/) links and `code`. Everything else is plain text.
function Inline({text}) {
	return text.split(/(\[[^\]]+\]\([^)]+\)|`[^`]+`)/).map((part, index) => {
		const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
		if (link && /^https?:/.test(link[2])) {
			return (
				<a key={index} href={link[2]} target="_blank" rel="noreferrer noopener">
					{link[1]}
				</a>
			)
		}
		if (link) return <a key={index} href={link[2]}>{link[1]}</a>
		if (part.startsWith('`')) return <code key={index}>{part.slice(1, -1)}</code>
		return <Fragment key={index}>{part}</Fragment>
	})
}

function Block({block}) {
	if (block.type === 'code') return <Code lang={block.lang} text={block.text} />
	if (block.type === 'list') {
		return (
			<ul>
				{block.items.map((item) => (
					<li key={item}>
						<Inline text={item} />
					</li>
				))}
			</ul>
		)
	}
	return (
		<p>
			<Inline text={block.text} />
		</p>
	)
}

function Tags({tags}) {
	return (
		<ul className="blog-tags">
			{tags.slice(0, 3).map((tag) => (
				<li key={tag}>{tag}</li>
			))}
		</ul>
	)
}

function Meta({post}) {
	return (
		<p className="blog-meta">
			<time dateTime={post.published}>{formatDate(post.published)}</time>
			<span aria-hidden="true">·</span>
			<span>{readingMinutes(post)} min read</span>
		</p>
	)
}

function PostCard({post, featured = false}) {
	return (
		<li className={featured ? 'post-card is-featured' : 'post-card'} style={{'--accent': accentFor(post)}}>
			<a href={`/blog/${post.slug}/`}>
				<Tags tags={post.tags} />
				<h2>{post.title}</h2>
				<p className="post-card-text">{featured ? post.answer : post.description}</p>
				<div className="post-card-foot">
					<Meta post={post} />
					<span className="post-card-cta">Read article →</span>
				</div>
			</a>
		</li>
	)
}

function BlogIndex() {
	const [latest, ...rest] = livePosts()
	return (
		<>
			<header className="blog-hero">
				<p className="eyebrow">
					<span className="eyebrow-index">Writing</span>
					<span className="eyebrow-line" />
					Engineering notes
				</p>
				<h1>Notes from building AI products</h1>
				<p className="blog-lede">What I learned shipping RAG, agents, SaaS backends and Android apps. Practical code, honest tradeoffs, and a few things for people just starting out.</p>
			</header>
			<ul className="post-grid">
				<PostCard post={latest} featured />
				{rest.map((post) => (
					<PostCard key={post.slug} post={post} />
				))}
			</ul>
		</>
	)
}

// Highlights the table of contents entry for the section being read.
function useActiveHeading(ids) {
	const [active, setActive] = useState(ids[0])
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries.filter((entry) => entry.isIntersecting)
				if (visible.length) setActive(visible[0].target.id)
			},
			{rootMargin: '-15% 0px -70% 0px'}
		)
		ids.forEach((id) => {
			const node = document.getElementById(id)
			if (node) observer.observe(node)
		})
		return () => observer.disconnect()
	}, [ids])
	return active
}

function Toc({sections}) {
	const ids = sections.map((section) => headingId(section.heading))
	const active = useActiveHeading(ids)
	return (
		<nav className="post-toc" aria-label="On this page">
			<p>On this page</p>
			<ol>
				{sections.map((section, index) => (
					<li key={ids[index]}>
						<a href={`#${ids[index]}`} aria-current={active === ids[index] ? 'true' : undefined}>
							{section.heading}
						</a>
					</li>
				))}
			</ol>
		</nav>
	)
}

function ShareBar({post}) {
	const toast = useToast()
	const url = `${site.url}/blog/${post.slug}/`
	const copy = async () => {
		try {
			await navigator.clipboard.writeText(url)
			toast('Link copied')
		} catch {
			toast('Copy the address bar link')
		}
	}
	return (
		<div className="share-bar">
			<span>Share</span>
			<button type="button" onClick={copy}>
				Copy link
			</button>
			<a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer">
				LinkedIn
			</a>
			<a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noreferrer">
				X
			</a>
		</div>
	)
}

function Post({post}) {
	const project = projects.find((item) => item.slug === post.project)
	const more = relatedPosts(post, livePosts())
	return (
		<>
			<header className="post-hero" style={{'--accent': accentFor(post)}}>
				<nav className="blog-crumbs" aria-label="Breadcrumb">
					<a href="/">Home</a>
					<span aria-hidden="true">/</span>
					<a href="/blog/">Writing</a>
				</nav>
				<Tags tags={post.tags} />
				<h1>{post.title}</h1>
				<div className="post-byline">
					<BrandMark size={34} />
					<div>
						<p>{site.name}</p>
						<Meta post={post} />
					</div>
				</div>
			</header>
			<div className="post-layout">
				<aside className="post-side">
					<Toc sections={post.sections} />
				</aside>
				<article className="post-body">
					<div className="takeaway">
						<p className="takeaway-label">The short version</p>
						<p>{post.answer}</p>
					</div>
					{post.sections.map((section) => (
						<section key={section.heading}>
							<h2 id={headingId(section.heading)}>
								<a className="anchor" href={`#${headingId(section.heading)}`} aria-hidden="true" tabIndex={-1}>
									#
								</a>
								{section.heading}
							</h2>
							{section.blocks.map((block, index) => (
								<Block key={index} block={block} />
							))}
						</section>
					))}
					<ShareBar post={post} />
					{project && (
						<a className="project-card" href={`/work/${project.slug}/`} style={{'--accent': project.accent}}>
							<span className="project-card-label">From the project</span>
							<strong>{project.name}</strong>
							<span>{project.tagline}</span>
							<span className="project-card-cta">Read the case study →</span>
						</a>
					)}
					<aside className="author-card">
						<BrandMark size={52} />
						<div>
							<p className="author-name">{site.name}</p>
							<p>
								{site.role} in {site.city}. I build AI products, web apps and Android apps end to end. Working on something similar? <a href={`mailto:${site.email}`}>Email me</a> or see the{' '}
								<a href="/#contact">other ways to reach me</a>.
							</p>
						</div>
					</aside>
				</article>
			</div>
			{more.length > 0 && (
				<section className="blog-more" aria-label="More writing">
					<h2>Keep reading</h2>
					<ul className="post-grid is-two">
						{more.map((item) => (
							<PostCard key={item.slug} post={item} />
						))}
					</ul>
				</section>
			)}
		</>
	)
}

export function BlogPage({route}) {
	return <main id="blog">{route.post ? <Post post={route.post} /> : <BlogIndex />}</main>
}
