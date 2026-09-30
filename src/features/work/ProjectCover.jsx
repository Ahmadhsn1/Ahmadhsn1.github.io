import {ProjectArt} from '@/features/work/ProjectArt.jsx'

export function ProjectCover({project, eager = false}) {
	if (typeof project.cover === 'object') return <ProjectArt name={project.cover.art} />
	return <img src={project.cover} style={project.coverPosition ? {'--cover-position': project.coverPosition} : undefined} alt={`${project.name} — ${project.type}`} loading={eager ? 'eager' : 'lazy'} decoding="async" />
}
