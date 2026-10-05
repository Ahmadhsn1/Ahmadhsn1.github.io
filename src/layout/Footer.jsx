import {projects} from '@/content/projects.js'
import {site, whatsappUrl} from '@/content/site.js'
import {BrandMark} from '@/components/BrandMark.jsx'
import {CaseLink} from '@/components/CaseLink.jsx'
import {SiteLink} from '@/components/SiteLink.jsx'

export function Footer({onPalette, onOpenCase}) {
	return (
		<footer className="site-footer">
			<div className="footer-inner page-shell">
				<SiteLink className="brand" to="/">
					<BrandMark size={32} />
					<span className="brand-text">
						<span className="brand-name">{site.name}</span>
						<span className="brand-role">{site.location}</span>
					</span>
				</SiteLink>
				<nav className="footer-links" aria-label="Elsewhere">
					<a href={`mailto:${site.email}`}>Email</a>
					<a href={whatsappUrl(site.phone)} target="_blank" rel="noreferrer">
						WhatsApp
					</a>
					<a href={site.linkedin} target="_blank" rel="noreferrer">
						LinkedIn
					</a>
					<a href={site.github} target="_blank" rel="noreferrer">
						GitHub
					</a>
					<button type="button" onClick={onPalette}>
						<kbd>⌘K</kbd>
					</button>
				</nav>
				<span className="footer-note">
					© {new Date().getFullYear()} {site.name} · {site.role} in {site.city}
				</span>
			</div>
			<nav className="footer-work page-shell" aria-label="Selected work">
				<span>Selected work</span>
				{projects.map((project) => (
					<CaseLink key={project.slug} slug={project.slug} onOpen={onOpenCase}>
						{project.name}
					</CaseLink>
				))}
			</nav>
		</footer>
	)
}
