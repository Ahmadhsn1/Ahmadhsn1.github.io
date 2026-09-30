import {ProjectArt} from '@/features/work/ProjectArt.jsx'
import {responsiveImage} from '@/lib/images.js'

const CARD_SIZES = '(max-width: 680px) 92vw, (max-width: 1080px) 46vw, 400px'
const HERO_SIZES = '(max-width: 1080px) 92vw, 600px'

export function ProjectCover({project, eager = false}) {
	if (typeof project.cover === 'object') return <ProjectArt name={project.cover.art} />
	return <img {...responsiveImage(project.cover)} sizes={eager ? HERO_SIZES : CARD_SIZES} style={project.coverPosition ? {'--cover-position': project.coverPosition} : undefined} alt={`${project.name} — ${project.type}`} loading={eager ? 'eager' : 'lazy'} decoding="async" />
}
