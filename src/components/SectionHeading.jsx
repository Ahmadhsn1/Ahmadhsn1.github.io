import {SplitWords} from './SplitWords.jsx'

export function SectionHeading({index, eyebrow, title, aside}) {
	return (
		<div className="section-heading" data-reveal>
			<div>
				<p className="eyebrow">
					<span className="eyebrow-index">{index}</span>
					<span className="eyebrow-line" />
					{eyebrow}
				</p>
				<h2>
					<SplitWords>{title}</SplitWords>
				</h2>
			</div>
			{aside && <p className="section-aside">{aside}</p>}
		</div>
	)
}
