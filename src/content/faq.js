import {site} from '@/content/site.js'

// Plain-text answers, written to stand alone. They are rendered on the page and reused as FAQPage structured data.
export const faq = [
	{
		question: 'Who is Ahmad Hassan?',
		answer: `Ahmad Hassan (GitHub: ${site.githubHandle}) is a software engineer based in ${site.location}. He builds AI products, web applications and native Android apps end to end, and is co-lead developer of EasyQuran, a Quran study app used by more than 10,000 families with a 4.9-star rating on Google Play.`,
	},
	{
		question: 'What kind of software does Ahmad Hassan build?',
		answer: 'AI products such as retrieval-augmented generation (RAG) assistants and tool-calling agents, full-stack web applications with React, Next.js and NestJS, multi-tenant SaaS on PostgreSQL and Supabase, and native Android apps in Kotlin and Java.',
	},
	{
		question: `Is Ahmad Hassan available for work in ${site.city}?`,
		answer: `Yes. He is based in ${site.city}, ${site.country}, and is open to engineering roles and project work, both locally and remotely. The fastest way to reach him is by email or WhatsApp.`,
	},
	{
		question: 'Which technologies does he work with?',
		answer: 'TypeScript, React, Next.js, Node.js, NestJS, Python and Flask on the web and backend side; PostgreSQL, MongoDB, Supabase, Redis and Firestore for data; Kotlin, Java and Jetpack Compose for Android; and Google Gemini, vector search and LangChain for AI.',
	},
	{
		question: 'Where can I see his work and code?',
		answer: `Eleven projects are documented with screenshots, metrics and engineering decisions on this site, and the source is on GitHub at github.com/${site.githubHandle}. Every number comes straight from the repositories.`,
	},
	{
		question: 'How can I contact Ahmad Hassan?',
		answer: `Email ${site.email}, message him on WhatsApp at ${site.phone}, or connect on LinkedIn.`,
	},
]
