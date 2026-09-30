import {Children, cloneElement, isValidElement} from 'react'

// Wraps every word of its children in a masked span so headings can rise in word by word.
// Styled inline elements such as <em> move as a single unit to keep their gradient intact.
export function SplitWords({children}) {
	let index = 0
	const word = (content, key) => (
		<span className="split-word" key={key}>
			<span style={{'--i': index++}}>{content}</span>
		</span>
	)

	const walk = (node, path) =>
		Children.map(node, (child, position) => {
			const key = `${path}-${position}`
			if (typeof child === 'string') {
				return child.split(/(\s+)/).map((part, partIndex) => (part.trim() ? word(part, `${key}-${partIndex}`) : part))
			}
			if (!isValidElement(child)) return child
			if (child.type === 'br') return child
			if (child.type === 'em') return word(child, key)
			return cloneElement(child, undefined, walk(child.props.children, key))
		})

	return walk(children, 'w')
}
