const BUG_LINE = [
	['pn', '  '],
	['kw', 'return '],
	['vr', 'data'],
	['pn', '.user.name'],
]
const FIX_LINE = [
	['pn', '  '],
	['kw', 'return '],
	['vr', 'data'],
	['pn', '.user'],
	['op', '?.'],
	['pn', 'name '],
	['op', '?? '],
	['st', "'Guest'"],
]
const HEAD_LINES = [
	[
		['kw', 'export '],
		['kw', 'async '],
		['kw', 'function '],
		['fn', 'getUser'],
		['pn', '('],
		['vr', 'id'],
		['pn', ') {'],
	],
	[
		['pn', '  '],
		['kw', 'const '],
		['vr', 'res'],
		['pn', ' = '],
		['kw', 'await '],
		['fn', 'fetch'],
		['pn', '('],
		['fn', 'url'],
		['pn', '('],
		['vr', 'id'],
		['pn', '))'],
	],
	[
		['pn', '  '],
		['kw', 'const '],
		['vr', 'data'],
		['pn', ' = '],
		['kw', 'await '],
		['vr', 'res'],
		['pn', '.'],
		['fn', 'json'],
		['pn', '()'],
	],
]
const CLOSE_LINE = [['pn', '}']]
const FIX_INDEX = 3
const TYPING_MS = 4600
const FIX_TYPING_MS = 2200
const TERMINAL_STEP_MS = 550

const lineLength = (tokens) => tokens.reduce((total, [, text]) => total + text.length, 0)

function sliceTokens(tokens, limit) {
	const visible = []
	let used = 0
	for (const [kind, text] of tokens) {
		if (used >= limit) break
		visible.push([kind, text.slice(0, limit - used)])
		used += text.length
	}
	return visible
}

function buildLines(phase, t) {
	const fixed = phase === 'fixing' || phase === 'success' || phase === 'coffee'
	const lines = [...HEAD_LINES, fixed ? FIX_LINE : BUG_LINE, CLOSE_LINE]
	const limits = lines.map(lineLength)
	let cursorLine = lines.length - 1

	if (phase === 'typing') {
		let budget = Math.floor(Math.min(1, t / TYPING_MS) * limits.reduce((a, b) => a + b, 0))
		limits.forEach((length, index) => {
			limits[index] = Math.max(0, Math.min(length, budget))
			if (budget > 0 && budget <= length) cursorLine = index
			budget -= length
		})
	}
	if (phase === 'fixing') {
		limits[FIX_INDEX] = Math.floor(Math.min(1, t / FIX_TYPING_MS) * limits[FIX_INDEX])
		cursorLine = FIX_INDEX
	}

	return lines.map((tokens, index) => ({
		tokens: sliceTokens(tokens, limits[index]),
		cursor: index === cursorLine,
		visible: phase !== 'typing' || index === 0 || limits[index - 1] === lineLength(lines[index - 1]),
	}))
}

export function CodeEditor({phase, t}) {
	const lines = buildLines(phase.id, t)
	const terminal = phase.terminal.slice(0, 1 + Math.floor(t / TERMINAL_STEP_MS))
	const dirty = phase.id === 'typing' || phase.id === 'fixing'

	return (
		<div className="code-editor" data-phase={phase.id} aria-hidden="true">
			<div className="editor-bar">
				<span className="editor-dots">
					<i />
					<i />
					<i />
				</span>
				<span className="editor-path">~/ahmad/api</span>
			</div>
			<div className="editor-tabs">
				<span className="editor-tab is-active">
					<b>TS</b> user.ts{dirty && <em className="tab-dirty" />}
				</span>
				<span className="editor-tab">
					<b>TS</b> user.test.ts
				</span>
			</div>
			<div className="editor-code">
				{lines.map((line, index) => (
					<div key={index} className={['code-line', !line.visible && 'is-empty', index === FIX_INDEX && `mark-${phase.id}`].filter(Boolean).join(' ')}>
						<span className="line-no">{index + 1}</span>
						<span className="line-text">
							{line.tokens.map(([kind, text], tokenIndex) => (
								<span key={tokenIndex} className={`tk-${kind}`}>
									{text}
								</span>
							))}
							{line.cursor && <span className="caret" />}
							{index === FIX_INDEX && phase.id === 'error' && <span className="inline-hint">← undefined</span>}
						</span>
					</div>
				))}
			</div>
			<div className="editor-terminal">
				<div className="terminal-head">
					<span>Terminal</span>
					<span>zsh</span>
				</div>
				{terminal.map((entry) => (
					<p key={entry.text} className={`term-${entry.tone}`}>
						{entry.text}
					</p>
				))}
			</div>
			<div className="editor-status">
				<span>⎇ main</span>
				<span className="status-phase">
					<i /> {phase.label}
				</span>
				<span className="status-right">TypeScript</span>
			</div>
		</div>
	)
}
