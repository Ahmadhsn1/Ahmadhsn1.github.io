// "AH" ligature: the A and the H share a single ember crossbar.
export function BrandMark({size = 36}) {
	return (
		<svg className="brand-mark" width={size} height={size} viewBox="0 0 36 36" aria-hidden="true" focusable="false">
			<rect className="bm-frame" x=".75" y=".75" width="34.5" height="34.5" rx="10.5" fill="#131316" stroke="rgb(255 255 255 / 16%)" strokeWidth="1.5" />
			<g className="bm-glyph" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
				<path className="bm-stroke" pathLength="1" d="M6.4 26.4 12.2 9.6 18 26.4" stroke="#f2efe8" />
				<path className="bm-stroke bm-stroke-h" pathLength="1" d="M22 9.6v16.8M29.6 9.6v16.8" stroke="#f2efe8" />
				<path className="bm-bar" pathLength="1" d="M9 19.8h20.6" stroke="#ff6a3d" />
			</g>
		</svg>
	)
}
