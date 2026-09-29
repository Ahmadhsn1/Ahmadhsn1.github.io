const spotlight = (event) => {
	const bounds = event.currentTarget.getBoundingClientRect()
	event.currentTarget.style.setProperty('--mx', `${event.clientX - bounds.left}px`)
	event.currentTarget.style.setProperty('--my', `${event.clientY - bounds.top}px`)
}

export function ProjectCard({project, index, featured}) {
	return (
		<article className={featured ? 'project is-featured' : 'project'} data-reveal style={{'--reveal-delay': `${(index % 3) * 80}ms`}} onPointerMove={spotlight}>
			<div className="project-media">
				<img src={project.image} alt={project.alt} loading="lazy" />
				<span className="project-number">{project.number}</span>
				<span className="project-type">{project.categories.join(' · ')}</span>
			</div>
			<div className="project-body">
				<div className="project-meta">
					<h3>{project.name}</h3>
					<span>{project.type}</span>
				</div>
				<p className="project-role">{project.role}</p>
				<p className="project-description">{project.description}</p>
				<ul className="project-highlights">
					{project.highlights.map((highlight) => (
						<li key={highlight}>{highlight}</li>
					))}
				</ul>
				<div className="project-foot">
					<div className="project-stack" aria-label="Technologies">
						{project.stack.map((technology) => (
							<span key={technology}>{technology}</span>
						))}
					</div>
					{project.links.length > 0 && (
						<div className="project-links" aria-label={`${project.name} links`}>
							{project.links.map((link) => (
								<a key={link.url} href={link.url} target="_blank" rel="noreferrer">
									{link.label}
									<span aria-hidden="true">↗</span>
								</a>
							))}
						</div>
					)}
				</div>
			</div>
		</article>
	)
}
