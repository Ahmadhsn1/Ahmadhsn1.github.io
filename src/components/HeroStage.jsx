import {useEffect, useRef, useState} from 'react'
import {storyPhases} from '../data/devStory.js'
import {CodeEditor} from './CodeEditor.jsx'
import {MetricsScreen, PipelineScreen} from './StageScreens.jsx'

const TICK_MS = 50
const RESTING_PHASE = storyPhases.findIndex((phase) => phase.id === 'success')
const BOOKS = [
	{h: 78, c: '#c9562f'},
	{h: 92, c: '#2b3446'},
	{h: 70, c: '#d8c7a3'},
	{h: 86, c: '#4a3b5c'},
	{h: 64, c: '#1f5a4a'},
]

// The hero set: a lit developer workstation behind a standing 3D-style portrait.
// Layers drift at different rates with the pointer to give the flat scene real depth.
export function HeroStage() {
	const stageRef = useRef(null)
	const [reduceMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
	const [onScreen, setOnScreen] = useState(true)
	const [clock, setClock] = useState(() => (reduceMotion ? {index: RESTING_PHASE, t: 60000} : {index: 0, t: 0}))
	const phase = storyPhases[clock.index]

	useEffect(() => {
		const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting))
		observer.observe(stageRef.current)
		return () => observer.disconnect()
	}, [])

	useEffect(() => {
		if (reduceMotion || !onScreen) return
		const timer = setInterval(() => {
			if (document.hidden) return
			setClock(({index, t}) => {
				const next = t + TICK_MS
				return next >= storyPhases[index].duration ? {index: (index + 1) % storyPhases.length, t: 0} : {index, t: next}
			})
		}, TICK_MS)
		return () => clearInterval(timer)
	}, [reduceMotion, onScreen])

	const move = (event) => {
		if (reduceMotion) return
		const bounds = event.currentTarget.getBoundingClientRect()
		event.currentTarget.style.setProperty('--mx', ((event.clientX - bounds.left) / bounds.width - 0.5).toFixed(3))
		event.currentTarget.style.setProperty('--my', ((event.clientY - bounds.top) / bounds.height - 0.5).toFixed(3))
	}

	const reset = (event) => {
		event.currentTarget.style.setProperty('--mx', 0)
		event.currentTarget.style.setProperty('--my', 0)
	}

	return (
		<figure className="hero-stage" data-phase={phase.id}>
			<div className="set" ref={stageRef} onPointerMove={move} onPointerLeave={reset}>
				<div className="set-room" aria-hidden="true">
				<div className="set-layer set-wall">
					<span className="wall-slats" />
					<span className="wall-wash" />
					<span className="neon">&lt;/&gt;</span>
					<div className="shelf">
						<div className="shelf-books">
							{BOOKS.map((book) => (
								<i key={book.c} style={{'--bh': `${book.h}%`, '--bc': book.c}} />
							))}
						</div>
						<span className="shelf-plant">
							<i />
							<i />
							<i />
						</span>
						<span className="shelf-board" />
					</div>
					<span className="led-strip" />
				</div>

				<div className="set-layer set-desk">
					<div className="lamp">
						<span className="lamp-arm" />
						<span className="lamp-head" />
						<span className="lamp-cone" />
					</div>
					<div className="monitor monitor-main">
						<span className="screenbar" />
						<div className="monitor-bezel">
							<div className="monitor-screen">
								<CodeEditor phase={phase} t={clock.t} />
							</div>
						</div>
						<span className="monitor-neck" />
						<span className="monitor-foot" />
					</div>
					<div className="monitor monitor-side">
						<div className="monitor-bezel">
							<div className="monitor-screen">
								<PipelineScreen phase={phase.id} />
							</div>
						</div>
						<span className="monitor-neck" />
						<span className="monitor-foot" />
					</div>
					<div className="desk">
						<span className="desk-top" />
						<span className="desk-edge" />
					</div>
					<div className="laptop">
						<div className="laptop-lid">
							<div className="monitor-screen">
								<MetricsScreen phase={phase.id} />
							</div>
						</div>
						<span className="laptop-base" />
					</div>
					<span className="keyboard" />
					<span className="mouse" />
					<span className="mug">
						<i />
						<i />
					</span>
				</div>
				<span className="room-vignette" />
				</div>

				<div className="set-layer set-hero">
					<div className="hero-figure">
						<span className="hero-contact" aria-hidden="true" />
						<img src="/hero/ahmad-3d.webp" alt="Ahmad Hassan as a stylised 3D character in a denim jacket, standing in front of his coding setup" width="514" height="1522" decoding="async" fetchPriority="high" />
						<span className="hero-light hero-light-key" aria-hidden="true" />
						<span className="hero-light hero-light-shade" aria-hidden="true" />
					</div>
				</div>

				<div className="stage-status" key={phase.id} aria-hidden="true">
					<span className="status-icon">{phase.icon}</span>
					{phase.label}
				</div>
			</div>
			<figcaption className="stage-steps">
				<span className="sr-only">The workstation plays a short loop: code, think, debug, fix, test and ship. Jump to a step:</span>
				{storyPhases.map((step, index) => (
					<button key={step.id} type="button" className={index === clock.index ? 'step is-active' : 'step'} aria-pressed={index === clock.index} onClick={() => setClock({index, t: 0})}>
						<span className="step-bar">
							<span style={{width: index < clock.index ? '100%' : index === clock.index ? `${Math.min(100, (clock.t / step.duration) * 100)}%` : '0%'}} />
						</span>
						{step.short}
					</button>
				))}
			</figcaption>
		</figure>
	)
}
