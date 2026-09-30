import {useEffect, useRef, useState} from 'react'

// Flips to true the first time the element scrolls into view, then stops observing.
export function useInView(options = {threshold: 0.3}) {
	const ref = useRef(null)
	const [inView, setInView] = useState(false)

	useEffect(() => {
		const node = ref.current
		if (!node) return
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				setInView(true)
				observer.disconnect()
			}
		}, options)
		observer.observe(node)
		return () => observer.disconnect()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return [ref, inView]
}
