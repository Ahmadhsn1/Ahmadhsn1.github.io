import {principles, stack} from '@/content/profile.js'
import {SectionHeading} from '@/components/SectionHeading.jsx'

export function HowIBuild() {
	return (
		<section className="build-section page-shell" id="stack" aria-labelledby="build-title">
			<SectionHeading
				index="04"
				eyebrow="How I build"
				title={
					<span id="build-title">
						Seven rules, and the tools <em>I reach for.</em>
					</span>
				}
			/>
			<div className="build-grid">
				<ol className="principles">
					{principles.map((principle, index) => (
						<li key={principle.title} data-reveal style={{'--reveal-delay': `${index * 60}ms`}}>
							<span>{String(index + 1).padStart(2, '0')}</span>
							<div>
								<h3>{principle.title}</h3>
								<p>{principle.text}</p>
							</div>
						</li>
					))}
				</ol>
				<div className="toolbox" data-reveal>
					<p className="toolbox-title">
						<span>~/stack</span>
						<span>shipped in production</span>
					</p>
					{stack.map((row) => (
						<div className="toolbox-row" key={row.group}>
							<span className="toolbox-group">{row.group}</span>
							<span className="toolbox-items">
								{row.items.map((item) => (
									<span key={item}>{item}</span>
								))}
							</span>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
