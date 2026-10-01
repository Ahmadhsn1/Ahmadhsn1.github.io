import {experience} from '@/content/profile.js'
import {CaseLink} from '@/components/CaseLink.jsx'
import {SectionHeading} from '@/components/SectionHeading.jsx'

export function Experience({onOpen}) {
	return (
		<section className="experience-section page-shell" id="experience" aria-labelledby="experience-title">
			<SectionHeading
				index="05"
				eyebrow="Experience"
				title={
					<span id="experience-title">
						Shipped with teams, <em>and alone.</em>
					</span>
				}
			/>
			<ol className="experience-list">
				{experience.map((item, index) => (
					<li key={item.org} data-reveal style={{'--reveal-delay': `${index * 80}ms`}}>
						<div className="experience-head">
							<h3>{item.role}</h3>
							<span>{item.org}</span>
						</div>
						<p>{item.detail}</p>
						{item.project && (
							<CaseLink slug={item.project} onOpen={onOpen} className="text-link">
								View the work <span aria-hidden="true">→</span>
							</CaseLink>
						)}
					</li>
				))}
			</ol>
		</section>
	)
}
