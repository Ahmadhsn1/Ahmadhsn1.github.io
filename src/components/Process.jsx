import {SectionHeading} from './SectionHeading.jsx'

const steps = [
	{number: '01', title: 'Think', text: 'Understand the real problem and the people behind it before a single line is written. Trade-offs get named, not discovered later.'},
	{number: '02', title: 'Build', text: 'Readable, typed, boring-in-the-best-way code. Clear boundaries — the booking engine stays the source of truth, the AI just talks to it.'},
	{number: '03', title: 'Break', text: 'Tests, tenant isolation, rate limits, reuse detection. I try to break it before your users do — 740+ automated checks and counting.'},
	{number: '04', title: 'Ship', text: 'Small, reversible releases with CI, audit logs and observability. Then I listen, measure and refine the next iteration.'},
]

export function Process() {
	return (
		<section className="process-section page-shell" id="process" aria-labelledby="process-title">
			<SectionHeading index="02" eyebrow="How I work" title={<span id="process-title">The same loop, <em>every time.</em></span>} aside="Just like the little guy up top: think, build, break it on purpose, then ship with confidence." />
			<ol className="process-grid">
				{steps.map((step, index) => (
					<li key={step.number} className="process-step" data-reveal style={{'--reveal-delay': `${index * 90}ms`}}>
						<span className="process-number">{step.number}</span>
						<h3>{step.title}</h3>
						<p>{step.text}</p>
					</li>
				))}
			</ol>
		</section>
	)
}
