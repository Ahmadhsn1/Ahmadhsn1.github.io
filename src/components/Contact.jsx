export function Contact() {
	return (
		<section className="contact-section page-shell" id="contact" aria-labelledby="contact-title">
			<div className="contact-card" data-reveal>
				<div className="contact-glow" aria-hidden="true" />
				<p className="eyebrow">
					<span className="eyebrow-index">04</span>
					<span className="eyebrow-line" />
					Let’s talk software
				</p>
				<h2 id="contact-title">
					Have a problem
					<br />
					worth <em>solving?</em>
				</h2>
				<p className="contact-copy">I’m open to software engineering roles and ambitious product work. The fastest way to reach me is LinkedIn.</p>
				<div className="contact-links">
					<a className="btn btn-primary" href="https://www.linkedin.com/in/ahmad-hassan0099/" target="_blank" rel="noreferrer">
						Message me on LinkedIn <span aria-hidden="true">↗</span>
					</a>
					<a className="btn btn-ghost" href="https://github.com/Ahmadhsn1" target="_blank" rel="noreferrer">
						Browse my GitHub <span aria-hidden="true">↗</span>
					</a>
				</div>
			</div>
		</section>
	)
}
