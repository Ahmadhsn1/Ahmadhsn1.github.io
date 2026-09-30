import {useEffect, useState} from 'react'
import {useInView} from '../hooks/useInView.js'

const NUMBER = /\d[\d,]*(\.\d+)?/

// Counts the numeric part of a label like "10,000+" or "4.9★" up from zero when it enters view.
export function CountUp({value, duration = 1400}) {
	const [ref, inView] = useInView({threshold: 0.6})
	const match = String(value).match(NUMBER)
	const target = match ? parseFloat(match[0].replace(/,/g, '')) : 0
	const decimals = match?.[1] ? match[1].length - 1 : 0
	const [current, setCurrent] = useState(0)
	const [reduceMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

	useEffect(() => {
		if (!inView || !match || reduceMotion) return
		let frame
		const start = performance.now()
		const tick = (now) => {
			const progress = Math.min(1, (now - start) / duration)
			setCurrent(target * (1 - Math.pow(1 - progress, 4)))
			if (progress < 1) frame = requestAnimationFrame(tick)
		}
		frame = requestAnimationFrame(tick)
		return () => cancelAnimationFrame(frame)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inView, target])

	if (!match) return <span ref={ref}>{value}</span>
	const shown = reduceMotion ? target : current
	const formatted = shown.toLocaleString('en-US', {minimumFractionDigits: decimals, maximumFractionDigits: decimals})
	const [before, after] = String(value).split(match[0])
	return (
		<span ref={ref} aria-label={value}>
			<span aria-hidden="true">
				{before}
				{formatted}
				{after}
			</span>
		</span>
	)
}
