import {useState} from 'react'
import {flushSync} from 'react-dom'
import {projectCategories, projects} from '@/content/projects.js'
import {ProjectCard} from '@/features/work/ProjectCard.jsx'
import {SectionHeading} from '@/components/SectionHeading.jsx'

export function ProjectGrid({onOpen}) {
	const [activeCategory, setActiveCategory] = useState('All')
	const visibleProjects = activeCategory === 'All' ? projects : projects.filter((project) => project.categories.includes(activeCategory))

	const choose = (category) => {
		if (category === activeCategory) return
		const update = () => flushSync(() => setActiveCategory(category))
		if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) document.startViewTransition(update)
		else update()
	}

	return (
		<section className="work-section page-shell" id="work" aria-labelledby="work-title">
			<SectionHeading
				index="01"
				eyebrow="Selected projects by Ahmad Hassan"
				title={
					<span id="work-title">
						Products built to <em>survive</em> real users.
					</span>
				}
				aside="Eleven products across AI, web and mobile. Open any card for the full case study — every number comes straight from the repo."
			/>
			<div className="project-filters" role="group" aria-label="Filter projects by category">
				{projectCategories.map((category) => (
					<button className={activeCategory === category ? 'filter-button is-active' : 'filter-button'} key={category} type="button" aria-pressed={activeCategory === category} onClick={() => choose(category)}>
						{category}
						<span>{category === 'All' ? projects.length : projects.filter((project) => project.categories.includes(category)).length}</span>
					</button>
				))}
			</div>
			<div className="project-grid">
				{visibleProjects.map((project, index) => (
					<ProjectCard key={project.slug} project={project} index={projects.indexOf(project)} featured={activeCategory === 'All' && index === 0} onOpen={onOpen} />
				))}
			</div>
		</section>
	)
}
