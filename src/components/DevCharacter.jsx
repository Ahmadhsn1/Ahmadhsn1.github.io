import {memo} from 'react'

const SKIN = '#f5c19d'
const SKIN_SHADE = '#e3a27d'
const SLEEVE = '#f1f4f9'
const INK = '#3a2418'

const confetti = [
	{x: 250, y: 120, dx: -120, dy: -70, r: 200, c: '#ff6a3d'},
	{x: 262, y: 118, dx: -80, dy: -110, r: -160, c: '#ffc56e'},
	{x: 258, y: 122, dx: -30, dy: -130, r: 240, c: '#f2efe8'},
	{x: 262, y: 120, dx: 40, dy: -125, r: -220, c: '#ff6a3d'},
	{x: 266, y: 118, dx: 95, dy: -100, r: 180, c: '#7dd3a8'},
	{x: 260, y: 124, dx: 135, dy: -55, r: -140, c: '#ffc56e'},
	{x: 256, y: 126, dx: -150, dy: -20, r: 160, c: '#7dd3a8'},
	{x: 264, y: 126, dx: 160, dy: -10, r: -200, c: '#f2efe8'},
]

// A hand-drawn SVG developer. Every pose is always in the DOM; CSS shows the
// right arms, eyes, mouth and effects for the current `data-phase`.
export const DevCharacter = memo(function DevCharacter({phase}) {
	return (
		<svg className="dev-svg" data-phase={phase} viewBox="0 0 560 500" aria-hidden="true" focusable="false">
			<defs>
				<radialGradient id="dv-skin" cx=".42" cy=".36" r=".78">
					<stop offset="0" stopColor="#ffe3ce" />
					<stop offset=".55" stopColor="#f5c19d" />
					<stop offset="1" stopColor="#d9956f" />
				</radialGradient>
				<linearGradient id="dv-hair" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stopColor="#a8703f" />
					<stop offset=".5" stopColor="#7a4a2b" />
					<stop offset="1" stopColor="#4a2a17" />
				</linearGradient>
				<linearGradient id="dv-shirt" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stopColor="#ffffff" />
					<stop offset=".6" stopColor="#edf1f7" />
					<stop offset="1" stopColor="#c9d3e2" />
				</linearGradient>
				<linearGradient id="dv-lid" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stopColor="#3a3a40" />
					<stop offset="1" stopColor="#1c1c21" />
				</linearGradient>
				<linearGradient id="dv-wood" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#8a6446" />
					<stop offset="1" stopColor="#6d4c33" />
				</linearGradient>
				<linearGradient id="dv-wood-front" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#4d3424" />
					<stop offset="1" stopColor="#241810" />
				</linearGradient>
				<linearGradient id="dv-mug" x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor="#ff8a5e" />
					<stop offset="1" stopColor="#e2502c" />
				</linearGradient>
				<radialGradient id="dv-iris" cx=".45" cy=".4" r=".62">
					<stop offset="0" stopColor="#a9c8e6" />
					<stop offset=".55" stopColor="#4d7aa6" />
					<stop offset="1" stopColor="#1f3a5c" />
				</radialGradient>
				<linearGradient id="dv-chair" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#2a2a31" />
					<stop offset="1" stopColor="#141418" />
				</linearGradient>
				<radialGradient id="dv-halo">
					<stop offset="0" className="halo-stop" stopOpacity=".55" />
					<stop offset="1" className="halo-stop" stopOpacity="0" />
				</radialGradient>
				<clipPath id="dv-eye-l">
					<ellipse cx="236" cy="162" rx="15" ry="18" />
				</clipPath>
				<clipPath id="dv-eye-r">
					<ellipse cx="284" cy="162" rx="15" ry="18" />
				</clipPath>
				<filter id="dv-soft" x="-50%" y="-50%" width="200%" height="200%">
					<feGaussianBlur stdDeviation="9" />
				</filter>
			</defs>

			<ellipse cx="280" cy="474" rx="250" ry="14" fill="#000" opacity=".5" filter="url(#dv-soft)" />
			<circle className="screen-halo" cx="260" cy="250" r="190" fill="url(#dv-halo)" />

			<g className="chair">
				<path d="M172 250c0-20 13-32 33-32h110c20 0 33 12 33 32v190H172z" fill="url(#dv-chair)" />
				<path d="M196 232h128" stroke="#4a4a54" strokeWidth="3" strokeLinecap="round" />
			</g>

			<g className="body">
				<g className="torso-breath">
					<g transform="translate(0 -16)">
					<path d="M166 332c0-28 24-44 56-48h76c32 4 56 20 56 48l6 104H160z" fill="url(#dv-shirt)" />
					<path d="M166 332c0-18 9-32 24-40-7 14-9 30-7 46l-2 98h-21z" fill="#c9d3e2" opacity=".7" />
					<path d="M354 332c0-18-9-32-24-40 7 14 9 30 7 46l2 98h21z" fill="#c9d3e2" opacity=".7" />
					<path d="M244 226h32l3 62h-38z" fill={SKIN_SHADE} />
					<path d="M243 232q17 16 34 0v14q-17 12-34 0z" fill="#c9825f" opacity=".55" />
					<path d="M241 284l19 30 19-30z" fill={SKIN_SHADE} />
					<path d="M240 280l22 34-14 7-22-30z" fill="#fff" stroke="#c9d3e2" strokeWidth="1.5" strokeLinejoin="round" />
					<path d="M280 280l-22 34 14 7 22-30z" fill="#fff" stroke="#c9d3e2" strokeWidth="1.5" strokeLinejoin="round" />
					<path d="M260 318v118" stroke="#d3dbe8" strokeWidth="2" />
					<circle cx="260" cy="338" r="2.8" fill="#b9c4d6" />
					<circle cx="260" cy="366" r="2.8" fill="#b9c4d6" />
					<circle cx="260" cy="394" r="2.8" fill="#b9c4d6" />
					<path d="M282 332h32v22q-16 7-32 0z" fill="none" stroke="#cbd4e3" strokeWidth="2" strokeLinejoin="round" />
					</g>
				</g>

				<g className="head">
					<g className="head-bob">
						<ellipse cx="195" cy="168" rx="12" ry="18" fill="#f0b590" />
						<path d="M198 160q-6 8 0 16" stroke={SKIN_SHADE} strokeWidth="3" fill="none" strokeLinecap="round" />
						<ellipse cx="325" cy="168" rx="12" ry="18" fill="#f0b590" />
						<path d="M322 160q6 8 0 16" stroke={SKIN_SHADE} strokeWidth="3" fill="none" strokeLinecap="round" />

						<path d="M196 156c0-50 28-78 64-78s64 28 64 78c0 48-26 84-64 86-38-2-64-38-64-86z" fill="url(#dv-skin)" />
						<path d="M204 190q10 44 56 50-42-12-56-50z" fill="#d9956f" opacity=".35" />
						<ellipse className="face-glow" cx="260" cy="200" rx="54" ry="36" opacity=".16" filter="url(#dv-soft)" />

						<ellipse cx="220" cy="198" rx="11" ry="6" fill="#ff8f8f" opacity=".32" />
						<ellipse cx="300" cy="198" rx="11" ry="6" fill="#ff8f8f" opacity=".32" />

						<path d="M192 158C184 110 204 72 240 60c32-10 70-4 86 22 12 20 10 50 2 76-6-26-14-42-26-52-14 6-32 6-48 0-14 8-32 8-44 0-8 14-14 32-18 52z" fill="url(#dv-hair)" />
						<path d="M206 104c-10-34 16-70 60-74 36-2 68 14 76 46-10-12-24-18-38-16 12 10 16 24 12 36-12-18-32-26-54-24-22 2-40 16-56 32z" fill="url(#dv-hair)" />
						<path d="M232 58c16-14 42-18 64-12m-46 30c14-8 32-8 46 0m-80 16c4-14 12-24 24-30" stroke="#c9925f" strokeWidth="4" fill="none" strokeLinecap="round" opacity=".6" />
						<path d="M308 60c14 6 24 16 28 28" stroke="#3d2212" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".5" />

						<g className="brows">
							<path className="brow brow-l" d="M220 138q16-10 32-2" stroke="#4a2a17" strokeWidth="7" strokeLinecap="round" fill="none" />
							<path className="brow brow-r" d="M268 136q16-8 32 2" stroke="#4a2a17" strokeWidth="7" strokeLinecap="round" fill="none" />
						</g>

						<g className="v eyes-open">
							<g className="eye">
								<ellipse cx="236" cy="162" rx="15" ry="18" fill="#fff" />
								<g clipPath="url(#dv-eye-l)">
									<g className="pupils">
										<circle cx="236" cy="164" r="10.5" fill="url(#dv-iris)" />
										<circle cx="236" cy="164" r="5.5" fill="#0e1420" />
										<circle cx="240" cy="159" r="3.2" fill="#fff" />
										<circle cx="232.5" cy="168" r="1.4" fill="#fff" opacity=".8" />
									</g>
								</g>
								<path d="M221 157q15-17 30 0" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
							</g>
							<g className="eye">
								<ellipse cx="284" cy="162" rx="15" ry="18" fill="#fff" />
								<g clipPath="url(#dv-eye-r)">
									<g className="pupils">
										<circle cx="284" cy="164" r="10.5" fill="url(#dv-iris)" />
										<circle cx="284" cy="164" r="5.5" fill="#0e1420" />
										<circle cx="288" cy="159" r="3.2" fill="#fff" />
										<circle cx="280.5" cy="168" r="1.4" fill="#fff" opacity=".8" />
									</g>
								</g>
								<path d="M269 157q15-17 30 0" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
							</g>
						</g>
						<g className="v eyes-happy" stroke={INK} strokeWidth="4.5" strokeLinecap="round" fill="none">
							<path d="M222 167q14-15 28 0" />
							<path d="M270 167q14-15 28 0" />
						</g>

						<ellipse cx="261" cy="190" rx="9" ry="7" fill="#eaa983" />
						<circle cx="258" cy="187" r="2.4" fill="#fff" opacity=".45" />

						<g className="mouths" fill="none" strokeLinecap="round" strokeWidth="4" stroke="#9a4a3e">
							<path className="v m-focus" d="M248 214q12 4 24-1" />
							<path className="v m-think" d="M250 216q11 1 22-6" />
							<path className="v m-worried" d="M246 218q7-7 14-2t14-3" />
							<g className="v m-grin" stroke="none">
								<path d="M240 206q20 30 40 0z" fill="#6e2a24" />
								<path d="M243 207h34q-2 6-17 6t-17-6z" fill="#fff" />
								<ellipse cx="260" cy="216" rx="8" ry="3.5" fill="#ff7b7b" />
							</g>
							<ellipse className="v m-sip" cx="262" cy="216" rx="5" ry="4" fill="#6e2a24" stroke="none" />
						</g>

						<g className="v fx-sweat">
							<path className="drop" d="M324 112c5 8 8 12 8 16a8 8 0 0 1-16 0c0-4 3-8 8-16z" fill="#9ad7ff" />
						</g>
					</g>
				</g>

				<g className="v arm arm-a-type">
					<g className="tap tap-a">
						<path d="M188 298c-22 8-30 40-24 78" stroke={SLEEVE} strokeWidth="34" strokeLinecap="round" fill="none" />
						<ellipse cx="165" cy="374" rx="19" ry="8" fill="#dbe3ef" transform="rotate(-8 165 374)" />
						<path d="M165 380c0 7-1 12-2 17" stroke={SKIN_SHADE} strokeWidth="20" strokeLinecap="round" fill="none" />
						<ellipse cx="166" cy="398" rx="14" ry="9" fill={SKIN} />
					</g>
				</g>
				<g className="v arm arm-a-chin">
					<path d="M188 298c-18 10-22 50-10 96" stroke={SLEEVE} strokeWidth="34" strokeLinecap="round" fill="none" />
					<path d="M190 392L234 256" stroke={SKIN_SHADE} strokeWidth="21" strokeLinecap="round" />
					<ellipse cx="238" cy="246" rx="17" ry="15" fill={SKIN} />
					<path d="M228 241q9-4 19 0m-19 8q9-4 19 0" stroke="#d9956f" strokeWidth="2" fill="none" strokeLinecap="round" />
				</g>

				<g className="v arm arm-b-type">
					<g className="tap tap-b">
						<path d="M332 298c22 8 30 40 24 78" stroke={SLEEVE} strokeWidth="34" strokeLinecap="round" fill="none" />
						<ellipse cx="355" cy="374" rx="19" ry="8" fill="#dbe3ef" transform="rotate(8 355 374)" />
						<path d="M355 380c0 7 1 12 2 17" stroke={SKIN_SHADE} strokeWidth="20" strokeLinecap="round" fill="none" />
						<ellipse cx="354" cy="398" rx="14" ry="9" fill={SKIN} />
					</g>
				</g>
				<g className="v arm arm-b-mug">
					<path d="M332 298c18 10 22 50 10 96" stroke={SLEEVE} strokeWidth="34" strokeLinecap="round" fill="none" />
					<path d="M330 392L298 240" stroke={SKIN_SHADE} strokeWidth="21" strokeLinecap="round" />
					<path d="M246 198h36v36a8 8 0 0 1-8 8h-20a8 8 0 0 1-8-8z" fill="url(#dv-mug)" />
					<path d="M246 199h36" stroke="#ffb49a" strokeWidth="3" strokeLinecap="round" />
					<path d="M282 206c14 0 14 24 0 24" stroke="#e2502c" strokeWidth="6" fill="none" />
					<ellipse cx="292" cy="226" rx="13" ry="12" fill={SKIN} />
					<g className="steam steam-held" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none">
						<path d="M256 190c-5-8 5-12 0-20" />
						<path d="M268 188c-5-8 5-12 0-20" />
					</g>
				</g>
				<g className="v arm arm-b-fist">
					<g className="pump">
						<path d="M334 300c24 4 42 14 52 28" stroke={SLEEVE} strokeWidth="34" strokeLinecap="round" fill="none" />
						<ellipse cx="388" cy="328" rx="18" ry="8" fill="#dbe3ef" transform="rotate(-70 388 328)" />
						<path d="M390 322L398 252" stroke={SKIN_SHADE} strokeWidth="21" strokeLinecap="round" />
						<ellipse cx="399" cy="240" rx="17" ry="16" fill={SKIN} />
						<path d="M389 234q10-4 20 0m-20 8q10-4 20 0" stroke="#d9956f" strokeWidth="2" fill="none" strokeLinecap="round" />
						<path d="M424 226l12-6m-10 24h14m-20-38l8-10" stroke="#ffc56e" strokeWidth="3" strokeLinecap="round" />
					</g>
				</g>
			</g>

			<g className="desk">
				<path d="M28 418a8 8 0 0 1 8-8h488a8 8 0 0 1 8 8v4H28z" fill="url(#dv-wood)" />
				<rect x="40" y="422" width="480" height="46" rx="4" fill="url(#dv-wood-front)" />
				<path d="M36 411h488" stroke="#b08564" strokeWidth="1.5" opacity=".6" />
			</g>

			<g className="plant">
				<g className="leaves">
					<path d="M92 368C70 350 64 322 74 300c16 16 22 40 18 68z" fill="#3f8f64" />
					<path d="M92 368c4-30 16-52 38-62 4 26-10 48-38 62z" fill="#2d6f4c" />
					<path d="M92 368c-6-34-2-62 12-80 12 24 8 54-12 80z" fill="#4fa877" />
					<path d="M92 368c-22-8-40-24-44-46 22 2 38 20 44 46z" fill="#2d6f4c" />
				</g>
				<path d="M70 366h44l-6 44H76z" fill="#d7d2c8" />
				<rect x="66" y="360" width="52" height="10" rx="4" fill="#bdb7ab" />
			</g>

			<g className="laptop">
				<path d="M166 402h188l10 9H156z" fill="#2c2c33" />
				<path d="M156 411h208" stroke="#55555f" strokeWidth="2" />
				<path d="M186 312h148q8 0 9 8l7 82H170l7-82q1-8 9-8z" fill="url(#dv-lid)" />
				<path d="M187 314h146" stroke="#fff" strokeWidth="1.5" opacity=".25" strokeLinecap="round" />
				<circle className="logo-halo" cx="260" cy="356" r="24" filter="url(#dv-soft)" />
				<text className="logo-text" x="260" y="361" textAnchor="middle">
					&lt;/&gt;
				</text>
				<g className="v fx-bug">
					<g className="bug-walk">
						<path d="M294 378l-6-4m5 10h-7m8 6l-6 4m18-16l4-5m-4 17l4 5" stroke="#1a1010" strokeWidth="1.8" strokeLinecap="round" />
						<ellipse cx="300" cy="384" rx="9" ry="7" fill="#ff5d5d" />
						<path d="M300 377v14" stroke="#1a1010" strokeWidth="1.5" />
						<circle cx="296" cy="382" r="1.6" fill="#1a1010" />
						<circle cx="304" cy="387" r="1.6" fill="#1a1010" />
						<circle cx="310" cy="383" r="4.5" fill="#1a1010" />
					</g>
				</g>
			</g>

			<g className="duck">
				<ellipse cx="392" cy="400" rx="15" ry="10" fill="#ffd23f" />
				<circle cx="400" cy="386" r="8.5" fill="#ffd23f" />
				<path d="M407 385l8 2-8 4z" fill="#ff8c42" />
				<circle cx="402" cy="384" r="1.6" fill="#222" />
				<path d="M382 398q6 4 12 0" stroke="#e0ad00" strokeWidth="2" fill="none" strokeLinecap="round" />
			</g>

			<g className="desk-mug">
				<path d="M424 372h32v32a8 8 0 0 1-8 8h-16a8 8 0 0 1-8-8z" fill="url(#dv-mug)" />
				<path d="M456 380c13 0 13 20 0 20" stroke="#e2502c" strokeWidth="6" fill="none" />
				<path d="M424 373h32" stroke="#ffb49a" strokeWidth="3" strokeLinecap="round" />
				<g className="steam" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none">
					<path d="M432 362c-5-8 5-12 0-20" />
					<path d="M442 364c-5-8 5-12 0-20" />
					<path d="M450 362c-5-8 5-12 0-20" />
				</g>
			</g>

			<g className="v fx-bubble">
				<circle className="bubble-dot d1" cx="198" cy="98" r="5" />
				<circle className="bubble-dot d2" cx="180" cy="78" r="8" />
				<g className="bubble-main">
					<ellipse cx="124" cy="46" rx="60" ry="34" />
					<text x="124" y="52" textAnchor="middle">
						if (!user) ?
					</text>
				</g>
			</g>

			<g className="v fx-bulb">
				<g className="bulb-pop">
					<circle className="bulb-glow" cx="352" cy="44" r="30" fill="#ffc56e" filter="url(#dv-soft)" />
					<path d="M352 22a15 15 0 0 1 9 27v6h-18v-6a15 15 0 0 1 9-27z" fill="#ffd27a" />
					<rect x="344" y="56" width="16" height="7" rx="2" fill="#9a9aa5" />
					<path d="M352 8v-8m24 20l6-6m-54 6l-6-6m66 30h8m-86 0h-8" stroke="#ffc56e" strokeWidth="3" strokeLinecap="round" />
				</g>
			</g>

			<g className="v fx-confetti">
				{confetti.map((piece) => (
					<rect key={`${piece.dx}-${piece.dy}`} className="confetti" x={piece.x} y={piece.y} width="7" height="12" rx="2" fill={piece.c} style={{'--dx': `${piece.dx}px`, '--dy': `${piece.dy}px`, '--rot': `${piece.r}deg`}} />
				))}
			</g>
		</svg>
	)
})
