import {Fragment} from 'react'
import {livePosts} from '@/content/posts.js'
import {projects} from '@/content/projects.js'
import {site} from '@/content/site.js'

const formatDate = (day) => new Date(`${day}T00:00:00Z`).toLocaleDateString('en-GB', {day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'})

// Inline text supports [label](/path/) links and `code`. Everything else is plain text.
function Inline({text}) {
	return text.split(/(\[[^\]]+\]\([^)]+\)|`[^`]+`)/).map((part, index) => {
		const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
		if (link) return <a key={index} href={link[2]}>{link[1]}</a>
		if (part.startsWith('`')) return <code key={index}>{part.slice(1, -1)}</code>
		return <Fragment key={index}>{part}</Fragment>
	})
}

function Block({block}) {
	if (block.type === 'code') {
		return (
			<pre className="blog-code">
				<code>{block.text}</code>
			</pre>
		)
	}
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

function PostMeta({post}) {
	return (
		<p className="blog-meta">
			By {site.name} · <time dateTime={post.published}>{formatDate(post.published)}</time>
			{post.updated !== post.published && (
				<>
					{' '}
					· Updated <time dateTime={post.updated}>{formatDate(post.updated)}</time>
				</>
			)}
		</p>
	)
}

function BlogIndex() {
	return (
		<article className="blog-shell">
			<p className="eyebrow">Writing</p>
			<h1>Notes from building AI products</h1>
			<p className="blog-lede">What I learned shipping RAG, agents, SaaS backends and Android apps, written from the projects in my portfolio.</p>
			<ul className="blog-list">
				{livePosts().map((post) => (
					<li key={post.slug}>
						<a href={`/blog/${post.slug}/`}>
							<h2>{post.title}</h2>
							<p>{post.description}</p>
							<PostMeta post={post} />
						</a>
					</li>
				))}
			</ul>
		</article>
	)
}

function Post({post}) {
	const project = projects.find((item) => item.slug === post.project)
	return (
		<article className="blog-shell">
			<nav className="blog-crumbs" aria-label="Breadcrumb">
				<a href="/">Home</a> / <a href="/blog/">Writing</a>
			</nav>
			<h1>{post.title}</h1>
			<PostMeta post={post} />
			<p className="blog-answer">{post.answer}</p>
			{post.sections.map((section) => (
				<section key={section.heading}>
					<h2>{section.heading}</h2>
					{section.blocks.map((block, index) => (
						<Block key={index} block={block} />
					))}
				</section>
			))}
			{project && (
				<aside className="blog-project">
					<p>This post comes from a real project.</p>
					<a href={`/work/${project.slug}/`}>Read the {project.name} case study</a>
				</aside>
			)}
			<p className="blog-contact">
				Working on something similar? <a href={`mailto:${site.email}`}>Email me</a> or see the <a href="/#contact">other ways to reach me</a>.
			</p>
		</article>
	)
}

export function BlogPage({route}) {
	return <main id="blog">{route.post ? <Post post={route.post} /> : <BlogIndex />}</main>
}
