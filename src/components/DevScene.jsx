import {useEffect, useRef, useState} from 'react'
import {storyPhases} from '../data/devStory.js'
import {CodeEditor} from './CodeEditor.jsx'
import {DevCharacter} from './DevCharacter.jsx'

const TICK_MS = 50
const RESTING_PHASE = storyPhases.findIndex((phase) => phase.id === 'success')

export function DevScene() {
	const stageRef = useRef(null)
	const [reduceMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
	const [clock, setClock] = useState(() => (reduceMotion ? {index: RESTING_PHASE, t: 60000} : {index: 0, t: 0}))
	const phase = storyPhases[clock.index]

	useEffect(() => {
		if (reduceMotion) return
		let onScreen = true
		const observer = new IntersectionObserver(([entry]) => {
			onScreen = entry.isIntersecting
		})
		observer.observe(stageRef.current)

		const timer = setInterval(() => {
			if (!onScreen || document.hidden) return
			setClock(({index, t}) => {
				const next = t + TICK_MS
				return next >= storyPhases[index].duration ? {index: (index + 1) % storyPhases.length, t: 0} : {index, t: next}
			})
		}, TICK_MS)

		return () => {
			clearInterval(timer)
			observer.disconnect()
		}
	}, [reduceMotion])

	const tilt = (event) => {
		const bounds = event.currentTarget.getBoundingClientRect()
		const x = (event.clientX - bounds.left) / bounds.width - 0.5
		const y = (event.clientY - bounds.top) / bounds.height - 0.5
		event.currentTarget.style.setProperty('--px', `${x * 14}px`)
		event.currentTarget.style.setProperty('--py', `${y * 10}px`)
	}

	const resetTilt = (event) => {
		event.currentTarget.style.setProperty('--px', '0px')
		event.currentTarget.style.setProperty('--py', '0px')
	}

	return (
		<figure className="dev-scene">
			<div className="dev-stage" ref={stageRef} onPointerMove={tilt} onPointerLeave={resetTilt}>
				<div className="stage-backdrop" aria-hidden="true">
					<span className="stage-orb" />
					<span className="stage-ring" />
				</div>
				<div className="stage-status" key={phase.id} aria-hidden="true">
					<span className="status-icon">{phase.icon}</span>
					{phase.label}
				</div>
				<div className="stage-character">
					<DevCharacter phase={phase.id} />
				</div>
				<CodeEditor phase={phase} t={clock.t} />
				<span className="stage-chip chip-a" aria-hidden="true">
					React 19
				</span>
				<span className="stage-chip chip-b" aria-hidden="true">
					NestJS
				</span>
			</div>
			<figcaption className="stage-steps">
				<span className="sr-only">An animated developer character codes, thinks, debugs, fixes, tests and ships. Jump to a step:</span>
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
