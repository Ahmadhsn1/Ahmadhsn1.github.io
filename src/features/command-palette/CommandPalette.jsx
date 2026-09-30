import {useEffect, useMemo, useRef, useState} from 'react'
import {projects} from '@/content/projects.js'
import {site, whatsappUrl} from '@/content/site.js'
import {useToast} from '@/components/Toast.jsx'

const jump = (id) => document.getElementById(id)?.scrollIntoView({behavior: 'smooth', block: 'start'})

export function CommandPalette({open, onClose, onOpenCase}) {
	const [query, setQuery] = useState('')
	const [cursor, setCursor] = useState(0)
	const inputRef = useRef(null)
	const toast = useToast()

	const commands = useMemo(
		() => [
			...projects.map((project) => ({group: 'Case studies', label: project.name, hint: project.type, run: () => onOpenCase(project.slug)})),
			{group: 'Navigate', label: 'Selected work', hint: 'Section', run: () => jump('work')},
			{group: 'Navigate', label: 'Engineering decisions', hint: 'Section', run: () => jump('decisions')},
			{group: 'Navigate', label: 'How I build', hint: 'Section', run: () => jump('stack')},
			{group: 'Navigate', label: 'Experience', hint: 'Section', run: () => jump('experience')},
			{group: 'Navigate', label: 'Contact', hint: 'Section', run: () => jump('contact')},
			{group: 'Contact', label: 'Copy email address', hint: site.email, run: () => navigator.clipboard.writeText(site.email).then(() => toast('Email copied to clipboard'))},
			{group: 'Contact', label: 'Send an email', hint: 'mailto', run: () => (window.location.href = `mailto:${site.email}`)},
			site.phone && {group: 'Contact', label: 'Call', hint: site.phone, run: () => (window.location.href = `tel:${site.phone}`)},
			site.phone && {group: 'Contact', label: 'Chat on WhatsApp', hint: 'wa.me', run: () => window.open(whatsappUrl(site.phone), '_blank', 'noopener')},
			{group: 'Contact', label: 'Open LinkedIn', hint: 'linkedin.com', run: () => window.open(site.linkedin, '_blank', 'noopener')},
			{group: 'Contact', label: 'Open GitHub', hint: 'github.com', run: () => window.open(site.github, '_blank', 'noopener')},
		].filter(Boolean),
		[onOpenCase, toast]
	)

	const results = useMemo(() => {
		const q = query.trim().toLowerCase()
		return q ? commands.filter((command) => `${command.label} ${command.hint} ${command.group}`.toLowerCase().includes(q)) : commands
	}, [commands, query])

	useEffect(() => {
		if (!open) return
		inputRef.current?.focus()
		document.documentElement.classList.add('is-locked')
		return () => document.documentElement.classList.remove('is-locked')
	}, [open])

	if (!open) return null

	const close = () => {
		setQuery('')
		setCursor(0)
		onClose()
	}
	const run = (command) => {
		close()
		command.run()
	}
	const onKeyDown = (event) => {
		if (event.key === 'Escape') close()
		if (event.key === 'ArrowDown') {
			event.preventDefault()
			setCursor((value) => Math.min(results.length - 1, value + 1))
		}
		if (event.key === 'ArrowUp') {
			event.preventDefault()
			setCursor((value) => Math.max(0, value - 1))
		}
		if (event.key === 'Enter' && results[cursor]) run(results[cursor])
	}

	let lastGroup = null
	return (
		<div className="palette-layer" onClick={close}>
			<div className="palette" role="dialog" aria-modal="true" aria-label="Command menu" onClick={(event) => event.stopPropagation()}>
				<div className="palette-input">
					<span aria-hidden="true">⌘</span>
					<input
						ref={inputRef}
						value={query}
						onChange={(event) => {
							setQuery(event.target.value)
							setCursor(0)
						}}
						onKeyDown={onKeyDown}
						placeholder="Search projects, sections, contact…"
						aria-label="Search commands"
						role="combobox"
						aria-expanded="true"
						aria-controls="palette-results"
						aria-activedescendant={results[cursor] ? `palette-item-${cursor}` : undefined}
					/>
					<kbd>Esc</kbd>
				</div>
				<ul className="palette-results" id="palette-results" role="listbox">
					{results.length === 0 && <li className="palette-empty">No matches for “{query}”</li>}
					{results.map((command, index) => {
						const heading = command.group !== lastGroup ? command.group : null
						lastGroup = command.group
						return (
							<li key={`${command.group}-${command.label}`} role="presentation">
								{heading && <p className="palette-group">{heading}</p>}
								<button type="button" role="option" id={`palette-item-${index}`} aria-selected={index === cursor} className={index === cursor ? 'is-active' : undefined} onPointerMove={() => setCursor(index)} onClick={() => run(command)}>
									<span>{command.label}</span>
									<small>{command.hint}</small>
								</button>
							</li>
						)
					})}
				</ul>
				<p className="palette-foot">
					<span>
						<kbd>↑</kbd>
						<kbd>↓</kbd> navigate
					</span>
					<span>
						<kbd>↵</kbd> open
					</span>
				</p>
			</div>
		</div>
	)
}
