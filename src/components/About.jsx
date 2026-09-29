import {SectionHeading} from './SectionHeading.jsx'

const toolbox = [
	{group: 'Languages', items: ['TypeScript', 'JavaScript', 'Kotlin', 'Java', 'Python']},
	{group: 'Frontend', items: ['React 19', 'Next.js 15', 'Vite', 'Design tokens']},
	{group: 'Backend', items: ['NestJS', 'Express 5', 'Flask', 'BullMQ · Redis']},
	{group: 'Data', items: ['PostgreSQL', 'Prisma', 'MongoDB', 'Supabase RLS', 'Firestore']},
	{group: 'AI', items: ['Gemini', 'RAG · vector search', 'Tool calling', 'SSE streaming']},
	{group: 'Mobile', items: ['Native Android', 'Jetpack Compose', 'Material 3', 'Firebase']},
]

const principles = ['Readable, maintainable code.', 'Reliable and secure by default.', 'People at the center.']

export function About() {
	return (
		<section className="about-section page-shell" id="about" aria-labelledby="about-title">
			<SectionHeading index="03" eyebrow="About" title={<span id="about-title">Good software starts with <em>clear thinking.</em></span>} />
			<div className="about-grid">
				<div className="about-copy" data-reveal>
					<p className="about-lead">I’m Ahmad Hassan — a software engineer who enjoys turning messy, real-world problems into calm, maintainable software.</p>
					<p>I care about the parts nobody demos: tenant isolation, idempotent jobs, honest AI that says “Unknown” instead of inventing an answer. I value thoughtful trade-offs and working closely with the people who actually use what I build.</p>
					<ul className="principles">
						{principles.map((principle) => (
							<li key={principle}>{principle}</li>
						))}
					</ul>
				</div>
				<div className="toolbox" data-reveal>
					<p className="toolbox-title">
						<span>~/toolbox</span>
						<span>6 groups</span>
					</p>
					{toolbox.map((row) => (
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
