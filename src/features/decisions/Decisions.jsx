import {useState} from 'react'
import {decisions} from '@/content/profile.js'
import {projects} from '@/content/projects.js'
import {CaseLink} from '@/components/CaseLink.jsx'
import {SectionHeading} from '@/components/SectionHeading.jsx'

export function Decisions({onOpen}) {
	const [active, setActive] = useState(0)
	const decision = decisions[active]
	const project = projects.find((item) => item.slug === decision.project)

	return (
		<section className="decisions-section page-shell" id="decisions" aria-labelledby="decisions-title">
			<SectionHeading
				index="03"
				eyebrow="Engineering judgement"
				title={
					<span id="decisions-title">
						Decisions I’d defend <em>in a review.</em>
					</span>
				}
				aside="The calls that separate a demo from a product. Pick one to see where it shipped."
			/>
			<div className="decisions" data-reveal>
				<div className="decision-list" role="tablist" aria-label="Engineering decisions" aria-orientation="vertical">
					{decisions.map((item, index) => (
						<button
							key={item.title}
							type="button"
							role="tab"
							id={`decision-tab-${index}`}
							aria-selected={index === active}
							aria-controls="decision-panel"
							className={index === active ? 'is-active' : undefined}
							onClick={() => setActive(index)}
							onFocus={() => setActive(index)}
							onPointerEnter={() => setActive(index)}
						>
							<span className="decision-index">{String(index + 1).padStart(2, '0')}</span>
							{item.title}
						</button>
					))}
				</div>
				<div className="decision-panel" id="decision-panel" role="tabpanel" aria-labelledby={`decision-tab-${active}`} style={{'--accent': project.accent}}>
					<div className="decision-panel-inner" key={active}>
						<span className="decision-big">{String(active + 1).padStart(2, '0')}</span>
						<h3>{decision.title}</h3>
						<p>{decision.text}</p>
						<CaseLink slug={project.slug} onOpen={onOpen} className="decision-project">
							<span>Shipped in</span>
							<strong>{project.name}</strong>
							<em>Read the case study →</em>
						</CaseLink>
					</div>
				</div>
			</div>
		</section>
	)
}
