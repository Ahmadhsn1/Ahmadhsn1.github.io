import {projects} from '@/content/projects.js'
import {services} from '@/content/services.js'
import {site} from '@/content/site.js'
import {CaseLink} from '@/components/CaseLink.jsx'
import {SectionHeading} from '@/components/SectionHeading.jsx'

const nameOf = (slug) => projects.find((project) => project.slug === slug)?.name ?? slug

export function Services({onOpen}) {
	return (
		<section className="services-section page-shell" id="services" aria-labelledby="services-title">
			<SectionHeading
				index="02"
				eyebrow="What I build"
				title={
					<span id="services-title">
						Web, AI and Android products, <em>built end to end.</em>
					</span>
				}
				aside={`Based in ${site.city}, working with teams and clients locally and remotely.`}
			/>
			<div className="services-grid">
				{services.map((service, index) => (
					<article className="service" key={service.id} data-reveal style={{'--reveal-delay': `${index * 70}ms`}}>
						<h3>{service.title}</h3>
						<p>{service.text}</p>
						<p className="service-examples">
							<span>Shipped in</span>
							{service.examples.map((slug) => (
								<CaseLink key={slug} slug={slug} onOpen={onOpen}>
									{nameOf(slug)}
								</CaseLink>
							))}
						</p>
					</article>
				))}
			</div>
		</section>
	)
}
