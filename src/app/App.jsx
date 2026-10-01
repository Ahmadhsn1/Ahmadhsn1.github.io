import {Suspense, lazy, useEffect, useState} from 'react'
import {useCaseRoute} from '@/hooks/useCaseRoute.js'
import {ToastProvider} from '@/components/Toast.jsx'
import {BackToTop} from '@/layout/BackToTop.jsx'
import {Backdrop} from '@/layout/Backdrop.jsx'
import {Footer} from '@/layout/Footer.jsx'
import {Header} from '@/layout/Header.jsx'
import {ScrollEffects} from '@/layout/ScrollEffects.jsx'
import {Contact} from '@/features/contact/Contact.jsx'
import {Decisions} from '@/features/decisions/Decisions.jsx'
import {Experience} from '@/features/experience/Experience.jsx'
import {Faq} from '@/features/faq/Faq.jsx'
import {Hero} from '@/features/hero/Hero.jsx'
import {HowIBuild} from '@/features/how-i-build/HowIBuild.jsx'
import {Services} from '@/features/services/Services.jsx'
import {ProjectGrid} from '@/features/work/ProjectGrid.jsx'
import {applyHead} from '@/seo/applyHead.js'

// Rarely-opened overlays ship as separate chunks and are prefetched once the page is idle.
const loadCaseStudy = () => import('@/features/work/CaseStudy.jsx')
const loadCommandPalette = () => import('@/features/command-palette/CommandPalette.jsx')
const CaseStudy = lazy(() => loadCaseStudy().then((module) => ({default: module.CaseStudy})))
const CommandPalette = lazy(() => loadCommandPalette().then((module) => ({default: module.CommandPalette})))

export default function App() {
	const {slug, open, close} = useCaseRoute()
	const [paletteOpen, setPaletteOpen] = useState(false)
	// A case study URL is prerendered on its own, without the home sections behind it. They are
	// added the first time the sheet closes (and stay mounted afterwards, so reopening is instant).
	const [homeMounted, setHomeMounted] = useState(!slug)
	if (!slug && !homeMounted) setHomeMounted(true)

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

	useEffect(() => {
		const prefetch = () => {
			loadCaseStudy()
			loadCommandPalette()
		}
		const idle = window.requestIdleCallback ? window.requestIdleCallback(prefetch, {timeout: 4000}) : setTimeout(prefetch, 2500)
		return () => (window.cancelIdleCallback ? window.cancelIdleCallback(idle) : clearTimeout(idle))
	}, [])

	useEffect(() => {
		applyHead(slug)
	}, [slug])

	return (
		<ToastProvider>
			<Backdrop />
			<ScrollEffects />
			<Header onPalette={() => setPaletteOpen(true)} homeMounted={homeMounted} />
			{homeMounted && (
				<main id="home" inert={slug ? true : undefined}>
					<Hero />
					<ProjectGrid onOpen={open} />
					<Services onOpen={open} />
					<Decisions onOpen={open} />
					<HowIBuild />
					<Experience onOpen={open} />
					<Faq />
					<Contact />
				</main>
			)}
			<Footer onPalette={() => setPaletteOpen(true)} onOpenCase={open} />
			<BackToTop />
			<Suspense fallback={null}>
				{slug && <CaseStudy slug={slug} onOpen={open} onClose={close} />}
				{paletteOpen && <CommandPalette open onClose={() => setPaletteOpen(false)} onOpenCase={open} />}
			</Suspense>
		</ToastProvider>
	)
}
