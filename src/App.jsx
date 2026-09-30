import {useEffect, useState} from 'react'
import {BackToTop} from './components/BackToTop.jsx'
import {CaseStudy} from './components/CaseStudy.jsx'
import {CommandPalette} from './components/CommandPalette.jsx'
import {Contact} from './components/Contact.jsx'
import {Decisions} from './components/Decisions.jsx'
import {Experience} from './components/Experience.jsx'
import {Footer} from './components/Footer.jsx'
import {Header} from './components/Header.jsx'
import {Hero} from './components/Hero.jsx'
import {HowIBuild} from './components/HowIBuild.jsx'
import {ProjectGrid} from './components/ProjectGrid.jsx'
import {ScrollEffects} from './components/ScrollEffects.jsx'
import {ToastProvider} from './components/Toast.jsx'
import {useCaseRoute} from './hooks/useCaseRoute.js'

export default function App() {
	const {slug, open, close} = useCaseRoute()
	const [paletteOpen, setPaletteOpen] = useState(false)

	useEffect(() => {
		const onKey = (event) => {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
				event.preventDefault()
				setPaletteOpen((value) => !value)
			}
		}
		window.addEventListener('keydown', onKey)
		return () => window.removeEventListener('keydown', onKey)
	}, [])

	return (
		<ToastProvider>
			<div className="backdrop" aria-hidden="true">
				<span className="backdrop-glow glow-a" />
				<span className="backdrop-glow glow-b" />
				<span className="backdrop-grid" />
				<span className="backdrop-grain" />
			</div>
			<ScrollEffects />
			<Header onPalette={() => setPaletteOpen(true)} />
			<main id="home" inert={slug ? true : undefined}>
				<Hero />
				<ProjectGrid onOpen={open} />
				<Decisions onOpen={open} />
				<HowIBuild />
				<Experience onOpen={open} />
				<Contact />
			</main>
			<Footer onPalette={() => setPaletteOpen(true)} />
			<BackToTop />
			<CaseStudy slug={slug} onOpen={open} onClose={close} />
			<CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onOpenCase={open} />
		</ToastProvider>
	)
}
