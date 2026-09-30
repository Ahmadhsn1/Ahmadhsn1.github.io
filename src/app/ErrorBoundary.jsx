import {Component} from 'react'
import {site} from '@/content/site.js'

// Last line of defence: if rendering fails, show a calm page with a way to reach me
// instead of a blank screen.
export class ErrorBoundary extends Component {
	state = {failed: false}

	static getDerivedStateFromError() {
		return {failed: true}
	}

	componentDidCatch(error, info) {
		console.error('Portfolio crashed while rendering', error, info.componentStack)
	}

	render() {
		if (!this.state.failed) return this.props.children
		return (
			<main className="crash">
				<p className="eyebrow">Something broke</p>
				<h1>This page hit an unexpected error.</h1>
				<p>
					Reload to try again, or reach me directly at <a href={`mailto:${site.email}`}>{site.email}</a>.
				</p>
				<button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
					Reload
				</button>
			</main>
		)
	}
}
