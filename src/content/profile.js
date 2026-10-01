// Content from the owner's GitHub profile README (github.com/Ahmadhsn1).

export const decisions = [
	{title: 'Money is never a float.', text: 'RetailFlow stores every amount as an integer and reconciles the cash drawer to the paisa before anyone goes home.', project: 'retailflow'},
	{title: 'The test suite is validated, not assumed.', text: 'NoteMind’s suite was proven by re-introducing real, previously-shipped bugs one at a time and confirming each one is caught.', project: 'notemind'},
	{
		title: 'The database is the security boundary.',
		text: 'SpendSmart ships with no server — firestore.rules is a deny-by-default whitelist. RetailFlow’s tenants are isolated by Row Level Security, not by a WHERE clause someone might forget.',
		project: 'spendsmart',
	},
	{
		title: 'The model is the last resort, not the first.',
		text: 'The Copper Larder answers caps, complaints and common questions from scripted intercepts and a cache; Gemini only ever sees what none of those could handle.',
		project: 'copper-larder',
	},
	{title: 'Offline is a feature, not a fallback.', text: 'MindScribe hands uploads to WorkManager so they finish after a reboot; EasyQuran works fully offline after the first download.', project: 'mindscribe'},
	{title: 'Revocation is instant.', text: 'NoteMind re-verifies the session against the database on every request — a revoked user is locked out now, not in fifteen minutes.', project: 'notemind'},
	{
		title: 'A public endpoint still needs teeth.',
		text: 'Aria’s booking API is unauthenticated by design, so every booking change is OTP-gated, rate-limited per IP, locked after repeated bad attempts and written to an audit log.',
		project: 'aria',
	},
	{
		title: 'The model orchestrates; it never owns the truth.',
		text: 'Each of Aria’s 15 tools wraps the exact domain service the e-Booking product’s own widget already calls — no second copy of availability logic to disagree with.',
		project: 'aria',
	},
	{
		title: 'Isolation belongs in the index, not the query.',
		text: 'Retrivo Vault’s per-user filter is part of the Atlas Vector Search index itself — a forgotten check can’t leak a chunk that was never a candidate.',
		project: 'retrivo-vault',
	},
	{
		title: 'A claim without a citation doesn’t ship.',
		text: 'LeadForge AI drops any model-made claim that can’t be traced to stored evidence, and computes its scores in code — the model only ever explains a number.',
		project: 'leadforge-ai',
	},
]

export const principles = [
	{title: 'Validate at the boundary.', text: 'Every write goes through a schema; bad input never reaches business logic.'},
	{title: 'Fail fast, at boot.', text: 'Misconfiguration should kill the process at startup with a readable error — not surface as a 500 next Tuesday.'},
	{title: 'Assume the model misbehaves.', text: 'Rate limits, quotas, timeouts, caches and fallbacks are part of the feature, not a follow-up ticket.'},
	{title: 'Isolate tenants in the database.', text: 'Authorization in application code is a suggestion; enforced by Row Level Security it is a guarantee.'},
	{title: 'Tests are how I move fast.', text: 'They aren’t bureaucracy — they’re what lets me refactor auth without fear.'},
	{title: 'Own the whole path.', text: 'Schema to store listing. If there’s a handoff, something falls through it.'},
	{title: 'Ship it.', text: 'Code that isn’t deployed doesn’t count.'},
]

export const stack = [
	{group: 'AI & Data', items: ['Google Gemini', 'OpenAI', 'LangChain', 'RAG pipelines', 'Tool calling', 'Vector search', 'Streamed output', 'Pandas']},
	{group: 'Frontend', items: ['React 19', 'Next.js 15 / 16', 'Server Components', 'TypeScript (strict)', 'Tiptap', 'shadcn/ui', 'd3-force']},
	{group: 'Backend', items: ['Node.js', 'NestJS', 'Express 5', 'Flask', 'Server-Sent Events', 'Socket.IO', 'BullMQ', 'Zod']},
	{group: 'Databases', items: ['PostgreSQL', 'Prisma', 'Supabase', 'Row Level Security', 'MongoDB', 'Atlas Vector Search', 'Firestore', 'Redis']},
	{group: 'Mobile', items: ['Kotlin', 'Java', 'Jetpack Compose', 'Material 3', 'WorkManager', 'React Native']},
	{group: 'DevOps', items: ['GitHub Actions', 'Docker', 'Vercel', 'Cloudflare R2', 'Stripe', 'Vitest']},
]

export const experience = [
	{
		role: 'Co-lead developer',
		org: 'EasyQuran',
		detail: 'One of two lead developers on a Saudi engineering team, alongside dedicated QA, content and marketing. Frontend and backend for a Quran study app live on the App Store and Google Play — 10,000+ families, 4.9★.',
		project: 'easyquran',
	},
	{
		role: 'Product engineer',
		org: 'Prime Coworking',
		detail: 'Built Aria, the AI booking assistant on top of the company’s e-Booking SaaS — LLM tool-calling over live domain services, OTP-gated mutations and an audit trail.',
		project: 'aria',
	},
	{
		role: 'Independent engineer',
		org: 'Open source',
		detail: 'Nine production-grade products shipped end to end — RAG, agents, multi-tenant SaaS and native Android — every number pulled straight from the repo.',
		project: null,
	},
]
