import {totals} from '../data/projects.js'
import {stack} from '../data/profile.js'
import {site} from '../data/site.js'
import {CountUp} from './CountUp.jsx'
import {DevScene} from './DevScene.jsx'

const stats = [
	{value: String(totals.projects), label: 'Products shipped'},
	{value: totals.tests.toLocaleString('en-US'), label: 'Automated tests written'},
	{value: '10,000+', label: 'Families on EasyQuran'},
	{value: '4.9★', label: 'Google Play rating'},
]

const marquee = stack.flatMap((row) => row.items)

export function Hero() {
	return (
		<>
			<section className="hero page-shell" aria-labelledby="hero-title">
				<div className="hero-copy">
					<p className="hero-kicker">
						<span className="kicker-line" /> {site.roleLong}
					</p>
					<h1 id="hero-title">
						I build AI products
						<br />
						that survive <em>real users.</em>
					</h1>
					<p className="hero-intro">
						I’m <strong>{site.name}</strong>. Most LLM work stops at “it calls the model and runs on my machine.” Mine is engineered for the parts that break in production — token budgets, tenant isolation, revocation-aware sessions, and deploys that actually happen.
					</p>
					<div className="hero-actions">
						<a className="btn btn-primary" href="#work">
							See the work <span aria-hidden="true">→</span>
						</a>
						<a className="btn btn-ghost" href="#contact">
							Get in touch
						</a>
					</div>
					<dl className="hero-stats">
						{stats.map((stat) => (
							<div key={stat.label}>
								<dt>{stat.label}</dt>
								<dd>
									<CountUp value={stat.value} />
								</dd>
							</div>
						))}
					</dl>
				</div>
				<DevScene />
			</section>
			<div className="marquee" aria-label="Technologies I ship with">
				<div className="marquee-track">
					{[...marquee, ...marquee].map((item, index) => (
						<span key={index} aria-hidden={index >= marquee.length}>
							{item}
						</span>
					))}
				</div>
			</div>
		</>
	)
}
