import {useSyncExternalStore} from 'react'
import {site} from '@/content/site.js'

const format = () => new Intl.DateTimeFormat('en-GB', {hour: '2-digit', minute: '2-digit', timeZone: site.timeZone}).format(new Date())

const subscribe = (notify) => {
	const timer = setInterval(notify, 15000)
	return () => clearInterval(timer)
}

// The clock only exists in the browser: the prerendered page leaves it blank rather than showing build time.
export function LocalTime() {
	const time = useSyncExternalStore(subscribe, format, () => '')
	return <time>{time}</time>
}
