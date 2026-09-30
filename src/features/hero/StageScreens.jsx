import {memo} from 'react'

// Secondary screens on the hero desk. Both follow the same story phase as the main editor.

const PIPELINE = ['lint', 'typecheck', 'test', 'build', 'deploy']

const pipelineState = {
	typing: {lint: 'ok', typecheck: 'ok', test: 'idle', build: 'idle', deploy: 'idle'},
	thinking: {lint: 'ok', typecheck: 'ok', test: 'run', build: 'idle', deploy: 'idle'},
	error: {lint: 'ok', typecheck: 'ok', test: 'fail', build: 'idle', deploy: 'idle'},
	fixing: {lint: 'ok', typecheck: 'ok', test: 'run', build: 'idle', deploy: 'idle'},
	success: {lint: 'ok', typecheck: 'ok', test: 'ok', build: 'ok', deploy: 'run'},
	coffee: {lint: 'ok', typecheck: 'ok', test: 'ok', build: 'ok', deploy: 'ok'},
}

const commits = {
	typing: ['feat: add getUser', 'chore: bump deps'],
	thinking: ['feat: add getUser', 'chore: bump deps'],
	error: ['feat: add getUser', 'chore: bump deps'],
	fixing: ['wip: guard user', 'feat: add getUser'],
	success: ['fix: guard user', 'feat: add getUser'],
	coffee: ['fix: guard user', 'feat: add getUser'],
}

const icon = {ok: '✓', fail: '✕', run: '', idle: '·'}

function PipelineView({phase}) {
	const state = pipelineState[phase]
	return (
		<div className="pipe-screen" aria-hidden="true">
			<p className="pipe-title">
				<span>CI · main</span>
				<i className={`pipe-badge is-${state.test === 'fail' ? 'fail' : state.deploy === 'ok' ? 'ok' : 'run'}`} />
			</p>
			<ol className="pipe-steps">
				{PIPELINE.map((step) => (
					<li key={step} className={`is-${state[step]}`}>
						<span className="pipe-icon">{icon[state[step]]}</span>
						{step}
					</li>
				))}
			</ol>
			<p className="pipe-title">
				<span>commits</span>
			</p>
			<ul className="pipe-commits">
				{commits[phase].map((message) => (
					<li key={message}>{message}</li>
				))}
			</ul>
		</div>
	)
}

const BARS = [38, 52, 44, 61, 57, 72, 66, 80, 74, 69, 83, 77, 88, 81]

function MetricsView({phase}) {
	const failing = phase === 'error'
	return (
		<div className={failing ? 'metrics-screen is-alert' : 'metrics-screen'} aria-hidden="true">
			<p className="metrics-title">
				<span>api · live</span>
				<span className="metrics-dot" />
			</p>
			<div className="metrics-bars">
				{BARS.map((height, index) => (
					<span key={index} style={{'--h': `${height}%`, '--d': `${index * 90}ms`}} />
				))}
			</div>
			<svg className="metrics-line" viewBox="0 0 100 24" preserveAspectRatio="none">
				<path d="M0 18 L10 16 L20 17 L30 12 L40 13 L50 9 L60 11 L70 7 L80 8 L90 5 L100 6" />
			</svg>
		</div>
	)
}

// Both depend only on the phase, so they skip the hero's frequent typing re-renders.
export const PipelineScreen = memo(PipelineView)
export const MetricsScreen = memo(MetricsView)
