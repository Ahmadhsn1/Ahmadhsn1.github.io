import {useEffect, useState} from 'react'
import {useCaseRoute} from '@/hooks/useCaseRoute.js'
import {ToastProvider} from '@/components/Toast.jsx'
import {BackToTop} from '@/layout/BackToTop.jsx'
import {Backdrop} from '@/layout/Backdrop.jsx'
import {Footer} from '@/layout/Footer.jsx'
import {Header} from '@/layout/Header.jsx'
import {ScrollEffects} from '@/layout/ScrollEffects.jsx'
import {CommandPalette} from '@/features/command-palette/CommandPalette.jsx'
import {Contact} from '@/features/contact/Contact.jsx'
import {Decisions} from '@/features/decisions/Decisions.jsx'
import {Experience} from '@/features/experience/Experience.jsx'
import {Hero} from '@/features/hero/Hero.jsx'
import {HowIBuild} from '@/features/how-i-build/HowIBuild.jsx'
import {CaseStudy} from '@/features/work/CaseStudy.jsx'
import {ProjectGrid} from '@/features/work/ProjectGrid.jsx'

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
			<Backdrop />
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
