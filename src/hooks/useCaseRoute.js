import {useCallback, useSyncExternalStore} from 'react'

// Case studies have real URLs (/work/<slug>/) so each one can be indexed and shared.
// Older shared links used #/work/<slug>, which are still understood.
const matchSlug = (pathname) => {
	const match = pathname.match(/^\/work\/([^/]+)\/?$/)
	return match ? decodeURIComponent(match[1]) : null
}
const legacyHashSlug = () => {
	const match = window.location.hash.match(/^#\/work\/([^/]+)/)
	return match ? decodeURIComponent(match[1]) : null
}
const readSlug = () => matchSlug(window.location.pathname) ?? legacyHashSlug()

// The prerenderer sets the page being rendered, since there is no window on the server.
let serverSlug = null
export const setServerPath = (path) => {
	serverSlug = matchSlug(path)
}

const listeners = new Set()
const emit = () => listeners.forEach((listener) => listener())
const subscribe = (listener) => {
	listeners.add(listener)
	window.addEventListener('popstate', listener)
	window.addEventListener('hashchange', listener)
	return () => {
		listeners.delete(listener)
		window.removeEventListener('popstate', listener)
		window.removeEventListener('hashchange', listener)
	}
}
const getServerSnapshot = () => (typeof window === 'undefined' ? serverSlug : readSlug())

// True when this session pushed a history entry for the open case study, so closing can go back to it.
let pushedByApp = false

export function useCaseRoute() {
	const slug = useSyncExternalStore(subscribe, readSlug, getServerSnapshot)

	const open = useCallback((next) => {
		const url = `/work/${next}/`
		if (readSlug()) window.history.replaceState(null, '', url)
		else {
			window.history.pushState(null, '', url)
			pushedByApp = true
		}
		emit()
	}, [])

	const close = useCallback(() => {
		if (pushedByApp) {
			pushedByApp = false
			window.history.back()
			return
		}
		window.history.replaceState(null, '', '/')
		window.scrollTo(0, 0)
		emit()
	}, [])

	return {slug, open, close}
}
