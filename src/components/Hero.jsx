import {DevScene} from './DevScene.jsx'

const stats = [
	{value: '11', label: 'Products shipped'},
	{value: '740+', label: 'Automated tests written'},
	{value: '10k+', label: 'Families on EasyQuran'},
	{value: '4.9★', label: 'Google Play rating'},
]

const stack = ['TypeScript', 'React 19', 'Next.js', 'NestJS', 'Node.js', 'Kotlin', 'Java', 'Python · Flask', 'PostgreSQL', 'MongoDB', 'Supabase', 'Redis · BullMQ', 'Gemini · RAG', 'Firebase']

export function Hero() {
	return (
		<>
			<section className="hero page-shell" aria-labelledby="hero-title">
				<div className="hero-copy">
					<p className="hero-kicker">
						<span className="kicker-line" /> Software Engineer — Web · Mobile · AI
					</p>
					<h1 id="hero-title">
						I engineer software
						<br />
						that <em>quietly works</em>
						<br />
						for real people.
					</h1>
					<p className="hero-intro">
						I’m <strong>Ahmad Hassan</strong>. I design, build and ship dependable products end to end — from tool-calling AI assistants to offline-first apps trusted by 10,000+ families.
					</p>
					<div className="hero-actions">
						<a className="btn btn-primary" href="#work">
							View selected work <span aria-hidden="true">→</span>
						</a>
						<a className="btn btn-ghost" href="#contact">
							Start a conversation
						</a>
					</div>
					<dl className="hero-stats">
						{stats.map((stat) => (
							<div key={stat.label}>
								<dt>{stat.label}</dt>
								<dd>{stat.value}</dd>
							</div>
						))}
					</dl>
				</div>
				<DevScene />
			</section>
			<div className="marquee" aria-label="Technologies I work with">
				<div className="marquee-track">
					{[...stack, ...stack].map((item, index) => (
						<span key={index} aria-hidden={index >= stack.length}>
							{item}
						</span>
					))}
				</div>
			</div>
		</>
	)
}
