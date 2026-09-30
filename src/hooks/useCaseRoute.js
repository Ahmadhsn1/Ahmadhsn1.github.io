import {useCallback, useEffect, useState} from 'react'

const PREFIX = '#/work/'
const readSlug = () => (window.location.hash.startsWith(PREFIX) ? decodeURIComponent(window.location.hash.slice(PREFIX.length)) : null)

// Case studies live at #/work/<slug> so they can be shared and the back button closes them.
export function useCaseRoute() {
	const [slug, setSlug] = useState(readSlug)

	useEffect(() => {
		const onHash = () => setSlug(readSlug())
		window.addEventListener('hashchange', onHash)
		return () => window.removeEventListener('hashchange', onHash)
	}, [])

	const open = useCallback((next) => {
		const url = `${PREFIX}${next}`
		if (readSlug()) window.history.replaceState(null, '', url)
		else window.history.pushState(null, '', url)
		setSlug(next)
	}, [])

	const close = useCallback(() => {
		window.history.replaceState(null, '', '#work')
		setSlug(null)
	}, [])

	return {slug, open, close}
}
