// A real link to a case study (so crawlers can follow it) that opens the in-page sheet for normal clicks.
export function CaseLink({slug, onOpen, children, ...props}) {
	const handleClick = (event) => {
		if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
		event.preventDefault()
		onOpen(slug)
	}
	return (
		<a href={`/work/${slug}/`} onClick={handleClick} {...props}>
			{children}
		</a>
	)
}
