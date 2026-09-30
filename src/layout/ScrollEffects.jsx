import {useEffect} from 'react'

export function ScrollEffects() {
	useEffect(() => {
		const root = document.querySelector('#root')
		const pendingReveals = new Set(document.querySelectorAll('[data-reveal]'))

		const revealVisible = () => {
			for (const element of pendingReveals) {
				const bounds = element.getBoundingClientRect()
				if (bounds.top < window.innerHeight * 0.9 && bounds.bottom > 24) {
					element.classList.add('is-visible')
					pendingReveals.delete(element)
				}
			}
		}

		const updateProgress = () => {
			const distance = document.documentElement.scrollHeight - window.innerHeight
			const progress = distance > 0 ? window.scrollY / distance : 0
			document.documentElement.style.setProperty('--scroll-progress', `${progress * 100}%`)
		}

		const scheduleUpdate = () => {
			revealVisible()
			updateProgress()
		}

		const addTargets = (node) => {
			if (!(node instanceof HTMLElement)) return
			if (node.matches('[data-reveal]')) pendingReveals.add(node)
			node.querySelectorAll('[data-reveal]').forEach((element) => pendingReveals.add(element))
			scheduleUpdate()
		}

		root.classList.add('has-scroll-reveal')
		revealVisible()
		updateProgress()
		window.addEventListener('scroll', scheduleUpdate, {passive: true})
		window.addEventListener('resize', scheduleUpdate)

		const mutations = new MutationObserver((records) => {
			records.forEach((record) => record.addedNodes.forEach(addTargets))
		})
		mutations.observe(root, {childList: true, subtree: true})

		return () => {
			root.classList.remove('has-scroll-reveal')
			mutations.disconnect()
			window.removeEventListener('scroll', scheduleUpdate)
			window.removeEventListener('resize', scheduleUpdate)
		}
	}, [])

	return <div className="scroll-progress" aria-hidden="true" />
}
