// One loop of a real developer's day, played by the hero character and the live editor.
export const storyPhases = [
	{
		id: 'typing',
		label: 'Writing a new feature',
		short: 'Code',
		icon: '⌨',
		duration: 5600,
		terminal: [
			{text: '$ npm run dev', tone: 'cmd'},
			{text: '➜ ready in 212 ms', tone: 'dim'},
		],
	},
	{
		id: 'thinking',
		label: 'Thinking through edge cases',
		short: 'Think',
		icon: '◎',
		duration: 3000,
		terminal: [
			{text: '$ npm test', tone: 'cmd'},
			{text: 'running 24 tests…', tone: 'dim'},
		],
	},
	{
		id: 'error',
		label: 'Found a bug',
		short: 'Debug',
		icon: '✕',
		duration: 3200,
		terminal: [
			{text: '$ npm test', tone: 'cmd'},
			{text: '✕ TypeError: user is undefined', tone: 'err'},
			{text: '  at getUser (user.ts:4:21)', tone: 'dim'},
		],
	},
	{
		id: 'fixing',
		label: 'Shipping the fix',
		short: 'Fix',
		icon: '✦',
		duration: 3400,
		terminal: [
			{text: '$ npm test -- --watch', tone: 'cmd'},
			{text: 're-running on change…', tone: 'dim'},
		],
	},
	{
		id: 'success',
		label: 'All tests passing',
		short: 'Test',
		icon: '✓',
		duration: 3000,
		terminal: [
			{text: '$ npm test', tone: 'cmd'},
			{text: '✓ 24 passed · 0 failed · 1.2s', tone: 'ok'},
		],
	},
	{
		id: 'coffee',
		label: 'Coffee, then git push',
		short: 'Ship',
		icon: '↑',
		duration: 3800,
		terminal: [
			{text: '$ git commit -m "fix: guard user"', tone: 'cmd'},
			{text: '$ git push origin main', tone: 'cmd'},
			{text: '✓ deployed to production', tone: 'ok'},
		],
	},
]
