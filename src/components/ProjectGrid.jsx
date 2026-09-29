import {useState} from 'react'
import {projects, projectCategories} from '../data/projects.js'
import {ProjectCard} from './ProjectCard.jsx'
import {SectionHeading} from './SectionHeading.jsx'

export function ProjectGrid() {
	const [activeCategory, setActiveCategory] = useState('All')
	const visibleProjects = activeCategory === 'All' ? projects : projects.filter((project) => project.categories.includes(activeCategory))

	return (
		<section className="work-section page-shell" id="work" aria-labelledby="work-title">
			<SectionHeading
				index="01"
				eyebrow="Selected work"
				title={
					<span id="work-title">
						Products built to <em>last</em>, not just to demo.
					</span>
				}
				aside="Eleven products across AI, web and mobile — every number below comes straight from the source repos."
			/>
			<div className="project-filters" role="group" aria-label="Filter projects by category">
				{projectCategories.map((category) => (
					<button className={activeCategory === category ? 'filter-button is-active' : 'filter-button'} key={category} type="button" aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)}>
						{category}
						<span>{category === 'All' ? projects.length : projects.filter((project) => project.categories.includes(category)).length}</span>
					</button>
				))}
			</div>
			<div className="project-grid">
				{visibleProjects.map((project, index) => (
					<ProjectCard key={project.number} project={project} index={index} featured={activeCategory === 'All' && index === 0} />
				))}
			</div>
		</section>
	)
}
