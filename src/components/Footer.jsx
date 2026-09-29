export function Footer() {
	return (
		<footer className="site-footer">
			<div className="footer-inner page-shell">
				<a className="brand" href="#home">
					<span className="brand-mark">AH</span>
					<span className="brand-name">Ahmad Hassan</span>
				</a>
				<span className="footer-note">Designed &amp; engineered by hand · © {new Date().getFullYear()}</span>
				<a className="footer-top" href="#home">
					Back to top ↑
				</a>
			</div>
		</footer>
	)
}
