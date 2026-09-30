import {formatPhone, site, whatsappUrl} from '../data/site.js'
import {LocalTime} from './LocalTime.jsx'
import {useToast} from './Toast.jsx'

export function Contact() {
	const toast = useToast()
	const copyEmail = async () => {
		try {
			await navigator.clipboard.writeText(site.email)
			toast('Email copied to clipboard')
		} catch {
			window.location.href = `mailto:${site.email}`
		}
	}

	const channels = [
		{label: 'Email', value: site.email, href: `mailto:${site.email}`},
		site.phone && {label: 'Phone', value: formatPhone(site.phone), href: `tel:${site.phone}`},
		site.phone && {label: 'WhatsApp', value: 'Start a chat', href: whatsappUrl(site.phone), external: true},
		{label: 'LinkedIn', value: `in/${site.linkedinHandle}`, href: site.linkedin, external: true},
		{label: 'GitHub', value: `@${site.githubHandle}`, href: site.github, external: true},
	].filter(Boolean)

	return (
		<section className="contact-section page-shell" id="contact" aria-labelledby="contact-title">
			<div className="contact-card" data-reveal>
				<div className="contact-glow" aria-hidden="true" />
				<div className="contact-main">
					<p className="eyebrow">
						<span className="eyebrow-index">05</span>
						<span className="eyebrow-line" />
						Contact
					</p>
					<h2 id="contact-title">
						Have a product
						<br />
						worth <em>shipping?</em>
					</h2>
					<p className="contact-copy">Open to AI and full-stack engineering roles — remote, from Lahore. Tell me what you’re building.</p>
					<div className="contact-actions">
						<a className="btn btn-primary" href={`mailto:${site.email}`}>
							Email me <span aria-hidden="true">→</span>
						</a>
						<button type="button" className="btn btn-ghost" onClick={copyEmail}>
							Copy email
						</button>
					</div>
					<p className="contact-meta">
						<span className="pulse-dot" /> Available now · {site.location} · <LocalTime /> PKT
					</p>
				</div>
				<ul className="contact-channels">
					{channels.map((channel) => (
						<li key={channel.label}>
							<a href={channel.href} {...(channel.external ? {target: '_blank', rel: 'noreferrer'} : {})}>
								<span className="channel-label">{channel.label}</span>
								<span className="channel-value">{channel.value}</span>
								<span className="channel-arrow" aria-hidden="true">
									↗
								</span>
							</a>
						</li>
					))}
				</ul>
			</div>
		</section>
	)
}
