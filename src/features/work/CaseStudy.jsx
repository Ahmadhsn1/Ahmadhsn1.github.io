import {useEffect, useRef, useState} from 'react'
import {projects} from '@/content/projects.js'
import {CountUp} from '@/components/CountUp.jsx'
import {ProjectCover} from '@/features/work/ProjectCover.jsx'

function Lightbox({items, index, onClose, onMove}) {
	const item = items[index]
	useEffect(() => {
		const onKey = (event) => {
			if (event.key === 'Escape') {
				event.stopPropagation()
				onClose()
			}
			if (event.key === 'ArrowRight') onMove(1)
			if (event.key === 'ArrowLeft') onMove(-1)
		}
		window.addEventListener('keydown', onKey, true)
		return () => window.removeEventListener('keydown', onKey, true)
	}, [onClose, onMove])

	return (
		<div className="lightbox" role="dialog" aria-modal="true" aria-label={item.caption} onClick={onClose}>
			<figure onClick={(event) => event.stopPropagation()}>
				<img src={item.src} alt={item.caption} className={item.tall ? 'is-tall' : undefined} />
				<figcaption>
					<span>
						{index + 1} / {items.length}
					</span>
					{item.caption}
				</figcaption>
			</figure>
			{items.length > 1 && (
				<>
					<button type="button" className="lightbox-nav is-prev" aria-label="Previous image" onClick={(event) => (event.stopPropagation(), onMove(-1))}>
						←
					</button>
					<button type="button" className="lightbox-nav is-next" aria-label="Next image" onClick={(event) => (event.stopPropagation(), onMove(1))}>
						→
					</button>
				</>
			)}
			<button type="button" className="lightbox-close" aria-label="Close image" onClick={onClose}>
				✕
			</button>
		</div>
	)
}

export function CaseStudy({slug, onOpen, onClose}) {
	const index = projects.findIndex((project) => project.slug === slug)
	const project = projects[index]
	const sheetRef = useRef(null)
	const lastFocus = useRef(null)
	const [shot, setShot] = useState(null)

	useEffect(() => {
		if (!project) return
		lastFocus.current ??= document.activeElement
		document.documentElement.classList.add('is-locked')
		sheetRef.current?.scrollTo({top: 0})
		sheetRef.current?.focus({preventScroll: true})
		return () => document.documentElement.classList.remove('is-locked')
	}, [project])

	useEffect(() => {
		if (project) return
		lastFocus.current?.focus?.({preventScroll: true})
		lastFocus.current = null
	}, [project])

	useEffect(() => {
		if (!project || shot !== null) return
		const onKey = (event) => {
			if (event.key === 'Escape') onClose()
			if (event.target.closest?.('input, textarea')) return
			if (event.key === 'ArrowRight') onOpen(projects[(index + 1) % projects.length].slug)
			if (event.key === 'ArrowLeft') onOpen(projects[(index - 1 + projects.length) % projects.length].slug)
		}
		window.addEventListener('keydown', onKey)
		return () => window.removeEventListener('keydown', onKey)
	}, [project, index, shot, onOpen, onClose])

	if (!project) return null
	const previous = projects[(index - 1 + projects.length) % projects.length]
	const next = projects[(index + 1) % projects.length]
	const number = String(index + 1).padStart(2, '0')

	return (
		<div className="case-layer" onClick={onClose}>
			<article className="case-sheet" ref={sheetRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="case-title" style={{'--accent': project.accent}} onClick={(event) => event.stopPropagation()} key={project.slug}>
				<header className="case-bar">
					<span className="case-crumb">
						<span>{number}</span> / {String(projects.length).padStart(2, '0')} · Case study
					</span>
					<div className="case-bar-actions">
						<button type="button" onClick={() => onOpen(previous.slug)} aria-label={`Previous project: ${previous.name}`}>
							←
						</button>
						<button type="button" onClick={() => onOpen(next.slug)} aria-label={`Next project: ${next.name}`}>
							→
						</button>
						<button type="button" className="case-close" onClick={onClose} aria-label="Close case study">
							Close <kbd>Esc</kbd>
						</button>
					</div>
				</header>

				<div className="case-hero">
					<div className="case-intro">
						<p className="case-type">{project.type}</p>
						<h2 id="case-title">{project.name}</h2>
						<p className="case-tagline">{project.tagline}</p>
						<dl className="case-facts">
							<div>
								<dt>Role</dt>
								<dd>{project.role}</dd>
							</div>
							{project.context && (
								<div>
									<dt>Context</dt>
									<dd>{project.context}</dd>
								</div>
							)}
							<div>
								<dt>Focus</dt>
								<dd>{project.categories.join(' · ')}</dd>
							</div>
						</dl>
						{project.links.length > 0 ? (
							<div className="case-links">
								{project.links.map((link, linkIndex) => (
									<a key={link.url} className={linkIndex === 0 ? 'btn btn-primary' : 'btn btn-ghost'} href={link.url} target="_blank" rel="noreferrer">
										{link.label} <span aria-hidden="true">↗</span>
									</a>
								))}
							</div>
						) : (
							<p className="case-private">{project.privateNote}</p>
						)}
					</div>
					<button type="button" className="case-cover" onClick={() => project.gallery.length && setShot(0)} disabled={!project.gallery.length} aria-label={project.gallery.length ? 'Open screenshots' : undefined}>
						<ProjectCover project={project} eager />
						{typeof project.cover === 'object' && <span className="case-cover-note">{project.links.length ? 'Illustration · see the live product' : 'Illustration · product screens are private'}</span>}
					</button>
				</div>

				<dl className="case-metrics">
					{project.metrics.map((metric) => (
						<div key={metric.label}>
							<dd>
								<CountUp value={metric.value} />
							</dd>
							<dt>{metric.label}</dt>
						</div>
					))}
				</dl>

				<section className="case-block">
					<h3>Overview</h3>
					<p className="case-summary">{project.summary}</p>
				</section>

				<section className="case-block">
					<h3>What it does</h3>
					<ul className="case-features">
						{project.features.map((feature) => (
							<li key={feature}>{feature}</li>
						))}
					</ul>
				</section>

				<section className="case-block">
					<h3>Engineering decisions</h3>
					<div className="case-decisions">
						{project.engineering.map((item, itemIndex) => (
							<div className="case-decision" key={item.title}>
								<span>{String(itemIndex + 1).padStart(2, '0')}</span>
								<h4>{item.title}</h4>
								<p>{item.text}</p>
							</div>
						))}
					</div>
				</section>

				<section className="case-block">
					<h3>Stack</h3>
					<dl className="case-stack">
						{Object.entries(project.stack).map(([layer, items]) => (
							<div key={layer}>
								<dt>{layer}</dt>
								<dd>
									{items.map((item) => (
										<span key={item}>{item}</span>
									))}
								</dd>
							</div>
						))}
					</dl>
				</section>

				{project.gallery.length > 0 && (
					<section className="case-block">
						<h3>Screens</h3>
						<div className={project.gallery.some((item) => item.tall) ? 'case-gallery is-tall' : 'case-gallery'}>
							{project.gallery.map((item, shotIndex) => (
								<button type="button" key={item.src} onClick={() => setShot(shotIndex)}>
									<img src={item.src} alt={item.caption} loading="lazy" decoding="async" />
									<span>{item.caption}</span>
								</button>
							))}
						</div>
					</section>
				)}

				<footer className="case-next">
					<button type="button" onClick={() => onOpen(next.slug)}>
						<span>Next project</span>
						<strong>
							{next.name} <em>→</em>
						</strong>
						<small>{next.tagline}</small>
					</button>
				</footer>
			</article>
			{shot !== null && <Lightbox items={project.gallery} index={shot} onClose={() => setShot(null)} onMove={(step) => setShot((current) => (current + step + project.gallery.length) % project.gallery.length)} />}
		</div>
	)
}
