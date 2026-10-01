import {useSyncExternalStore} from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

const subscribe = (notify) => {
	const media = window.matchMedia(QUERY)
	media.addEventListener('change', notify)
	return () => media.removeEventListener('change', notify)
}

// Safe for prerendering: the server (and the hydration pass) assume motion is allowed,
// then React re-renders with the real preference.
export function usePrefersReducedMotion() {
	return useSyncExternalStore(
		subscribe,
		() => window.matchMedia(QUERY).matches,
		() => false
	)
}
