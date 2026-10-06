import {navigateHome} from '@/hooks/useCaseRoute.js'

// A real link to the home page (or a section of it) that navigates in place instead of reloading.
export function SiteLink({to = '/', onClick, ...props}) {
	const handleClick = (event) => {
		onClick?.(event)
		if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
		// Away from the home page (the blog) there is nothing to scroll to in place: let the browser load the page.
		if (window.location.pathname.startsWith('/blog')) return
		event.preventDefault()
		navigateHome(to)
	}
	return <a href={to} onClick={handleClick} {...props} />
}
