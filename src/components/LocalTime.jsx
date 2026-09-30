import {useEffect, useState} from 'react'
import {site} from '../data/site.js'

const format = () => new Intl.DateTimeFormat('en-GB', {hour: '2-digit', minute: '2-digit', timeZone: site.timeZone}).format(new Date())

export function LocalTime() {
	const [time, setTime] = useState(format)
	useEffect(() => {
		const timer = setInterval(() => setTime(format()), 15000)
		return () => clearInterval(timer)
	}, [])
	return <time>{time}</time>
}
