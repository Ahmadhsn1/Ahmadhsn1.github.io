import {ProjectCover} from '@/features/work/ProjectCover.jsx'

const spotlight = (event) => {
	const bounds = event.currentTarget.getBoundingClientRect()
	event.currentTarget.style.setProperty('--mx', `${event.clientX - bounds.left}px`)
	event.currentTarget.style.setProperty('--my', `${event.clientY - bounds.top}px`)
}

export function ProjectCard({project, index, featured, onOpen}) {
	const number = String(index + 1).padStart(2, '0')
	return (
		<article className={featured ? 'project is-featured' : 'project'} style={{'--accent': project.accent, viewTransitionName: `card-${project.slug}`}} onPointerMove={spotlight} data-reveal>
			<button type="button" className="project-hit" onClick={() => onOpen(project.slug)} aria-label={`Open the ${project.name} case study`} />
			<div className="project-media">
				<ProjectCover project={project} />
				<span className="project-number">{number}</span>
				<span className="project-open" aria-hidden="true">
					Case study <span>→</span>
				</span>
			</div>
			<div className="project-body">
				<p className="project-type">{project.type}</p>
				<h3>{project.name}</h3>
				<p className="project-tagline">{project.tagline}</p>
				<dl className="project-metrics">
					{project.metrics.slice(0, featured ? 4 : 2).map((metric) => (
						<div key={metric.label}>
							<dt>{metric.label}</dt>
							<dd>{metric.value}</dd>
						</div>
					))}
				</dl>
				<p className="project-tags">
					{project.categories.map((category) => (
						<span key={category}>{category}</span>
					))}
				</p>
			</div>
		</article>
	)
}
