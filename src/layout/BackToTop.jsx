import {useEffect, useState} from 'react'

export function BackToTop() {
	const [shown, setShown] = useState(false)

	useEffect(() => {
		const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.8)
		window.addEventListener('scroll', onScroll, {passive: true})
		return () => window.removeEventListener('scroll', onScroll)
	}, [])

	return (
		<button type="button" className={shown ? 'to-top is-shown' : 'to-top'} aria-label="Back to top" tabIndex={shown ? 0 : -1} onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
			<span aria-hidden="true">↑</span>
		</button>
	)
}
