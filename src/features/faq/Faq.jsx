import {faq} from '@/content/faq.js'
import {SectionHeading} from '@/components/SectionHeading.jsx'

// Native <details> keeps every answer in the HTML for search engines and works without JavaScript.
export function Faq() {
	return (
		<section className="faq-section page-shell" id="faq" aria-labelledby="faq-title">
			<SectionHeading
				index="06"
				eyebrow="Questions"
				title={
					<span id="faq-title">
						Common questions, <em>answered.</em>
					</span>
				}
			/>
			<div className="faq-list" data-reveal>
				{faq.map((item, index) => (
					<details className="faq-item" key={item.question} open={index === 0}>
						<summary>
							<h3>{item.question}</h3>
							<span className="faq-icon" aria-hidden="true" />
						</summary>
						<p>{item.answer}</p>
					</details>
				))}
			</div>
		</section>
	)
}
