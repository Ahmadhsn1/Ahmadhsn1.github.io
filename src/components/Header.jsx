import {useEffect, useState} from 'react'

const links = [
	{href: '#work', label: 'Work'},
	{href: '#process', label: 'Process'},
	{href: '#about', label: 'About'},
	{href: '#contact', label: 'Contact'},
]

export function Header() {
	const [menuOpen, setMenuOpen] = useState(false)
	const [scrolled, setScrolled] = useState(() => window.scrollY > 24)
	const closeMenu = () => setMenuOpen(false)

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 24)
		window.addEventListener('scroll', onScroll, {passive: true})
		return () => window.removeEventListener('scroll', onScroll)
	}, [])

	return (
		<header className={scrolled ? 'site-header is-scrolled' : 'site-header'}>
			<div className="header-bar">
				<a className="brand" href="#home" onClick={closeMenu} aria-label="Ahmad Hassan, home">
					<span className="brand-mark">AH</span>
					<span className="brand-name">Ahmad Hassan</span>
				</a>
				<nav id="primary-navigation" className={menuOpen ? 'site-nav is-open' : 'site-nav'} aria-label="Main navigation">
					{links.map((link) => (
						<a key={link.href} href={link.href} onClick={closeMenu}>
							{link.label}
						</a>
					))}
					<a className="nav-cta" href="#contact" onClick={closeMenu}>
						<span className="pulse-dot" /> Available for hire
					</a>
				</nav>
				<button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="primary-navigation" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} onClick={() => setMenuOpen(!menuOpen)}>
					<span />
					<span />
				</button>
			</div>
		</header>
	)
}
