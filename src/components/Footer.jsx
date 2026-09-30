import {site, whatsappUrl} from '../data/site.js'
import {BrandMark} from './BrandMark.jsx'

export function Footer({onPalette}) {
	return (
		<footer className="site-footer">
			<div className="footer-inner page-shell">
				<a className="brand" href="#home">
					<BrandMark size={32} />
					<span className="brand-text">
						<span className="brand-name">{site.name}</span>
						<span className="brand-role">{site.location}</span>
					</span>
				</a>
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
				<span className="footer-note">© {new Date().getFullYear()} {site.name} · Designed and engineered by hand</span>
			</div>
		</footer>
	)
}
