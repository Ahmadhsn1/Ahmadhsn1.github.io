import {faq} from '@/content/faq.js'
import {stack} from '@/content/profile.js'
import {projects} from '@/content/projects.js'
import {site} from '@/content/site.js'
import {absoluteUrl, pageMeta} from '@/seo/meta.js'

const ids = {
	person: () => `${absoluteUrl('/')}#person`,
	website: () => `${absoluteUrl('/')}#website`,
}

const knowsAbout = [
	'Software engineering',
	'Web development',
	'Web design',
	'Artificial intelligence',
	'Retrieval-augmented generation',
	'LLM agents',
	'Android development',
	'Multi-tenant SaaS',
	...stack.flatMap((group) => group.items).filter((item) => !['Pandas', 'Tiptap', 'd3-force', 'shadcn/ui', 'Streamed output'].includes(item)),
]

const person = () => ({
	'@type': 'Person',
	'@id': ids.person(),
	name: site.name,
	alternateName: [site.githubHandle],
	url: absoluteUrl('/'),
	image: absoluteUrl('/images/hero/ahmad-3d.webp'),
	jobTitle: 'Software Engineer',
	description: `${site.headline}. Builds AI products, web applications and native Android apps end to end.`,
	email: `mailto:${site.email}`,
	telephone: site.phone,
	address: {'@type': 'PostalAddress', addressLocality: site.city, addressCountry: 'PK'},
	knowsAbout,
	sameAs: [site.github, site.linkedin],
})

const website = () => ({
	'@type': 'WebSite',
	'@id': ids.website(),
	url: absoluteUrl('/'),
	name: site.name,
	alternateName: [`${site.name} Portfolio`, site.githubHandle],
	description: site.headline,
	inLanguage: 'en',
	publisher: {'@id': ids.person()},
})

const breadcrumbs = (items) => ({
	'@type': 'BreadcrumbList',
	itemListElement: items.map((item, index) => ({'@type': 'ListItem', position: index + 1, name: item.name, item: absoluteUrl(item.path)})),
})

// Everything a page declares about itself, as one JSON-LD graph.
export function schemaFor(slug, builtOn) {
	const meta = pageMeta(slug)
	const project = projects.find((item) => item.slug === slug)

	if (!project) {
		return {
			'@context': 'https://schema.org',
			'@graph': [
				website(),
				person(),
				{
					'@type': 'ProfilePage',
					'@id': `${absoluteUrl('/')}#profile`,
					url: absoluteUrl('/'),
					name: meta.title,
					description: meta.description,
					dateModified: builtOn,
					mainEntity: {'@id': ids.person()},
					isPartOf: {'@id': ids.website()},
				},
				{
					'@type': 'ItemList',
					'@id': `${absoluteUrl('/')}#projects`,
					name: `Projects by ${site.name}`,
					numberOfItems: projects.length,
					itemListElement: projects.map((project, index) => ({
						'@type': 'ListItem',
						position: index + 1,
						url: absoluteUrl(`/work/${project.slug}/`),
						name: project.name,
					})),
				},
				{
					'@type': 'FAQPage',
					'@id': `${absoluteUrl('/')}#faq`,
					mainEntity: faq.map((entry) => ({'@type': 'Question', name: entry.question, acceptedAnswer: {'@type': 'Answer', text: entry.answer}})),
				},
			],
		}
	}

	const url = absoluteUrl(meta.path)
	const repository = project.links.find((link) => link.url.startsWith('https://github.com/') && !link.url.includes('/releases'))
	return {
		'@context': 'https://schema.org',
		'@graph': [
			website(),
			person(),
			{
				'@type': 'WebPage',
				'@id': `${url}#page`,
				url,
				name: meta.title,
				description: meta.description,
				dateModified: builtOn,
				isPartOf: {'@id': ids.website()},
				breadcrumb: {'@id': `${url}#breadcrumb`},
				primaryImageOfPage: absoluteUrl(meta.image),
				mainEntity: {'@id': `${url}#project`},
			},
			{
				'@type': repository ? ['CreativeWork', 'SoftwareSourceCode'] : 'CreativeWork',
				'@id': `${url}#project`,
				...(repository ? {codeRepository: repository.url} : {}),
				name: project.name,
				headline: project.tagline,
				description: project.summary,
				url,
				image: absoluteUrl(meta.image),
				author: {'@id': ids.person()},
				creator: {'@id': ids.person()},
				genre: project.type,
				keywords: Object.values(project.stack).flat().join(', '),
				sameAs: project.links.map((link) => link.url),
				inLanguage: 'en',
			},
			{
				...breadcrumbs([
					{name: site.name, path: '/'},
					{name: 'Work', path: '/#work'},
					{name: project.name, path: meta.path},
				]),
				'@id': `${url}#breadcrumb`,
			},
		],
	}
}
