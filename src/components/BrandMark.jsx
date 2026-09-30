export function BrandMark({size = 36}) {
	return (
		<svg className="brand-mark" width={size} height={size} viewBox="0 0 36 36" aria-hidden="true" focusable="false">
			<rect x=".75" y=".75" width="34.5" height="34.5" rx="10.5" fill="#131316" stroke="rgb(255 255 255 / 16%)" strokeWidth="1.5" />
			<path d="M8.5 26 14.2 10l5.7 16" fill="none" stroke="#f2efe8" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M23 10v16m0-8.5c.9-1.6 2.2-2.4 3.7-2.4 2 0 3.3 1.3 3.3 3.8V26" fill="none" stroke="#f2efe8" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
			<circle cx="14.2" cy="20.6" r="1.9" fill="#ff6a3d" />
		</svg>
	)
}
