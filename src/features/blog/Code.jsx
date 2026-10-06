import {Fragment} from 'react'
import {useToast} from '@/components/Toast.jsx'
import {tokenize} from '@/lib/tokenize.js'

const labels = {js: 'JavaScript', ts: 'TypeScript', json: 'JSON', sql: 'SQL', text: 'Prompt'}

export function Code({lang = 'text', text}) {
	const toast = useToast()
	const copy = async () => {
		try {
			await navigator.clipboard.writeText(text)
			toast('Code copied')
		} catch {
			toast('Press ⌘C to copy')
		}
	}
	return (
		<figure className="code-block">
			<figcaption>
				<span>{labels[lang] ?? lang}</span>
				<button type="button" onClick={copy} aria-label="Copy code">
					Copy
				</button>
			</figcaption>
			<pre tabIndex={0}>
				<code>
					{tokenize(text, lang).map((token, index) => (
						<Fragment key={index}>{token.type === 'plain' ? token.text : <span className={`tok-${token.type}`}>{token.text}</span>}</Fragment>
					))}
				</code>
			</pre>
		</figure>
	)
}
