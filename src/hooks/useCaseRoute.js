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
let serverPath = '/'
export const setServerPath = (path) => {
	serverSlug = matchSlug(path)
	serverPath = path
}
export const currentPath = () => (typeof window === 'undefined' ? serverPath : window.location.pathname)

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

// Goes to the home page (or a section of it, e.g. '/#work') without reloading the page.
// Used by the logo and the navigation: a plain link to the current URL would reload the site.
export function navigateHome(to = '/') {
	const hash = to.includes('#') ? to.slice(to.indexOf('#') + 1) : ''
	const scrollToTarget = (attempt = 0) => {
		if (!hash) return window.scrollTo({top: 0, behavior: 'smooth'})
		const section = document.getElementById(hash)
		// Opening the site straight on a case study mounts the sections a moment later.
		if (section) section.scrollIntoView({behavior: 'smooth', block: 'start'})
		else if (attempt < 8) setTimeout(() => scrollToTarget(attempt + 1), 80)
	}
	const sheetWasOpen = readSlug() !== null
	pushedByApp = false
	window.history.replaceState(null, '', to)
	if (sheetWasOpen) emit()
	window.requestAnimationFrame(() => scrollToTarget())
}

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
