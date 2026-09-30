import {experience} from '../data/profile.js'
import {SectionHeading} from './SectionHeading.jsx'

export function Experience({onOpen}) {
	return (
		<section className="experience-section page-shell" id="experience" aria-labelledby="experience-title">
			<SectionHeading index="04" eyebrow="Experience" title={<span id="experience-title">Shipped with teams, <em>and alone.</em></span>} />
			<ol className="experience-list">
				{experience.map((item, index) => (
					<li key={item.org} data-reveal style={{'--reveal-delay': `${index * 80}ms`}}>
						<div className="experience-head">
							<h3>{item.role}</h3>
							<span>{item.org}</span>
						</div>
						<p>{item.detail}</p>
						{item.project && (
							<button type="button" className="text-link" onClick={() => onOpen(item.project)}>
								View the work <span aria-hidden="true">→</span>
							</button>
						)}
					</li>
				))}
			</ol>
		</section>
	)
}
