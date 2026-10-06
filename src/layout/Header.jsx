import {useEffect, useState, useSyncExternalStore} from 'react'
import {livePosts} from '@/content/posts.js'
import {site} from '@/content/site.js'
import {BrandMark} from '@/components/BrandMark.jsx'
import {SiteLink} from '@/components/SiteLink.jsx'

const links = [
	{id: 'work', label: 'Work'},
	{id: 'decisions', label: 'Decisions'},
	{id: 'stack', label: 'Stack'},
	{id: 'experience', label: 'Experience'},
	{id: 'contact', label: 'Contact'},
]

const subscribeToScroll = (notify) => {
	window.addEventListener('scroll', notify, {passive: true})
	return () => window.removeEventListener('scroll', notify)
}

// homeMounted: the page sections only exist on the home page, so the active-link tracking restarts when they appear.
export function Header({onPalette, homeMounted}) {
	const [menuOpen, setMenuOpen] = useState(false)
	const scrolled = useSyncExternalStore(
		subscribeToScroll,
		() => window.scrollY > 24,
		() => false
	)
	const [current, setCurrent] = useState('')
	const closeMenu = () => setMenuOpen(false)

	useEffect(() => {
		if (!homeMounted) return
		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries.filter((entry) => entry.isIntersecting)
				if (visible.length) setCurrent(visible[0].target.id)
			},
			{rootMargin: '-45% 0px -50% 0px'}
		)
		links.forEach((link) => {
			const section = document.getElementById(link.id)
			if (section) observer.observe(section)
		})
		return () => observer.disconnect()
	}, [homeMounted])

	return (
		<header className={scrolled ? 'site-header is-scrolled' : 'site-header'}>
			<div className="header-bar">
				<SiteLink className="brand" to="/" onClick={closeMenu}>
					<BrandMark />
					<span className="brand-text">
						<span className="brand-name">{site.name}</span>
						<span className="brand-role">{site.role}</span>
					</span>
				</SiteLink>
				<nav id="primary-navigation" className={menuOpen ? 'site-nav is-open' : 'site-nav'} aria-label="Main navigation">
					{links.map((link) => (
						<SiteLink key={link.id} to={`/#${link.id}`} onClick={closeMenu} aria-current={current === link.id ? 'true' : undefined}>
							{link.label}
						</SiteLink>
					))}
					{livePosts().length > 0 && <a href="/blog/">Writing</a>}
				</nav>
				<div className="header-actions">
					<button type="button" className="palette-trigger" onClick={onPalette} aria-label="Search ⌘K">
						<span>Search</span>
						<kbd>⌘K</kbd>
					</button>
					<SiteLink className="nav-cta" to="/#contact" onClick={closeMenu}>
						<span className="pulse-dot" /> Hire me
					</SiteLink>
					<button
						className="menu-toggle"
						type="button"
						aria-expanded={menuOpen}
						aria-controls="primary-navigation"
						aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
						onClick={() => setMenuOpen(!menuOpen)}
					>
						<span />
						<span />
					</button>
				</div>
			</div>
		</header>
	)
}
