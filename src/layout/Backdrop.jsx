// Fixed ambient layer behind the page: warm glows, a fading grid and film grain.
export function Backdrop() {
	return (
		<div className="backdrop" aria-hidden="true">
			<span className="backdrop-glow glow-a" />
			<span className="backdrop-glow glow-b" />
			<span className="backdrop-grid" />
			<span className="backdrop-grain" />
		</div>
	)
}
