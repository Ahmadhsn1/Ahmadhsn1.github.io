import {useEffect, useState} from 'react'
import {site} from '../data/site.js'
import {BrandMark} from './BrandMark.jsx'

const links = [
	{href: '#work', label: 'Work'},
	{href: '#decisions', label: 'Decisions'},
	{href: '#stack', label: 'Stack'},
	{href: '#experience', label: 'Experience'},
	{href: '#contact', label: 'Contact'},
]

export function Header({onPalette}) {
	const [menuOpen, setMenuOpen] = useState(false)
	const [scrolled, setScrolled] = useState(() => window.scrollY > 24)
	const [current, setCurrent] = useState('')
	const closeMenu = () => setMenuOpen(false)

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 24)
		window.addEventListener('scroll', onScroll, {passive: true})
		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries.filter((entry) => entry.isIntersecting)
				if (visible.length) setCurrent(`#${visible[0].target.id}`)
			},
			{rootMargin: '-45% 0px -50% 0px'}
		)
		links.forEach((link) => {
			const section = document.querySelector(link.href)
			if (section) observer.observe(section)
		})
		return () => {
			window.removeEventListener('scroll', onScroll)
			observer.disconnect()
		}
	}, [])

	return (
		<header className={scrolled ? 'site-header is-scrolled' : 'site-header'}>
			<div className="header-bar">
				<a className="brand" href="#home" onClick={closeMenu} aria-label={`${site.name}, home`}>
					<BrandMark />
					<span className="brand-text">
						<span className="brand-name">{site.name}</span>
						<span className="brand-role">{site.role}</span>
					</span>
				</a>
				<nav id="primary-navigation" className={menuOpen ? 'site-nav is-open' : 'site-nav'} aria-label="Main navigation">
					{links.map((link) => (
						<a key={link.href} href={link.href} onClick={closeMenu} aria-current={current === link.href ? 'true' : undefined}>
							{link.label}
						</a>
					))}
				</nav>
				<div className="header-actions">
					<button type="button" className="palette-trigger" onClick={onPalette} aria-label="Open command menu">
						<span>Search</span>
						<kbd>⌘K</kbd>
					</button>
					<a className="nav-cta" href="#contact" onClick={closeMenu}>
						<span className="pulse-dot" /> Hire me
					</a>
					<button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="primary-navigation" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} onClick={() => setMenuOpen(!menuOpen)}>
						<span />
						<span />
					</button>
				</div>
			</div>
		</header>
	)
}
