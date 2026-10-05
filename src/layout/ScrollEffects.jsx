import {useEffect} from 'react'

// Reveals [data-reveal] elements as they enter the viewport and drives the top progress bar.
// Visibility comes from an IntersectionObserver (no layout reads on scroll), and the progress
// bar writes one CSS variable per animation frame at most.
export function ScrollEffects() {
	useEffect(() => {
		const root = document.querySelector('#root')
		root.classList.add('has-scroll-reveal')

		// Elements that have been revealed once. React rewrites a node's whole className whenever one of its own
		// class props changes (for example the featured project card when the filter changes), which would drop
		// the imperatively added `is-visible` and leave a card invisible but still clickable.
		const revealed = new WeakSet()

		const reveal = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue
					entry.target.classList.add('is-visible')
					revealed.add(entry.target)
					reveal.unobserve(entry.target)
				}
			},
			{rootMargin: '0px 0px -10% 0px'}
		)
		const watch = (node) => {
			if (!(node instanceof HTMLElement)) return
			if (node.matches('[data-reveal]')) reveal.observe(node)
			node.querySelectorAll('[data-reveal]:not(.is-visible)').forEach((element) => reveal.observe(element))
		}
		watch(root)

		const mutations = new MutationObserver((records) => {
			for (const record of records) {
				if (record.type === 'attributes') {
					if (revealed.has(record.target) && !record.target.classList.contains('is-visible')) record.target.classList.add('is-visible')
				} else {
					record.addedNodes.forEach(watch)
				}
			}
		})
		mutations.observe(root, {childList: true, subtree: true, attributes: true, attributeFilter: ['class']})

		// Only the two elements that read scroll progress get the variables; writing them on <html>
		// would restyle the whole document every frame.
		let frame = 0
		const updateProgress = () => {
			frame = 0
			const distance = document.documentElement.scrollHeight - window.innerHeight
			const ratio = distance > 0 ? Math.min(1, window.scrollY / distance) : 0
			document.querySelector('.scroll-progress')?.style.setProperty('--scroll-ratio', ratio.toFixed(4))
			document.querySelector('.to-top')?.style.setProperty('--scroll-progress', `${(ratio * 100).toFixed(2)}%`)
		}
		const onScroll = () => {
			if (!frame) frame = requestAnimationFrame(updateProgress)
		}
		frame = requestAnimationFrame(updateProgress)
		window.addEventListener('scroll', onScroll, {passive: true})
		window.addEventListener('resize', onScroll)

		return () => {
			root.classList.remove('has-scroll-reveal')
			reveal.disconnect()
			mutations.disconnect()
			cancelAnimationFrame(frame)
			window.removeEventListener('scroll', onScroll)
			window.removeEventListener('resize', onScroll)
		}
	}, [])

	return <div className="scroll-progress" aria-hidden="true" />
}
