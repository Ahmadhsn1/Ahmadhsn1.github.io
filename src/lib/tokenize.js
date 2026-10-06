const keywords = {
	js: 'const let var function return if else for of in async await import from export default new throw try catch class while null undefined true false typeof',
	sql: 'create table function returns language as declare begin end if then select into from insert values update set where and or not null references primary key default check enable row level security policy on for using alter return returning coalesce sum raise exception generated always identity bigint integer jsonb uuid text',
}
keywords.ts = keywords.js
keywords.json = 'true false null'

// A small tokenizer for the languages used in the posts: comments, strings, numbers and keywords.
export function tokenize(code, lang) {
	const words = keywords[lang]
	if (!words) return [{type: 'plain', text: code}]
	const comment = lang === 'sql' ? '--[^\\n]*' : '\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/'
	const pattern = new RegExp(`(${comment})|('(?:\\\\.|[^'\\\\])*'|"(?:\\\\.|[^"\\\\])*"|\`(?:\\\\.|[^\`\\\\])*\`)|\\b(\\d[\\d_.]*)\\b|\\b(${words.split(' ').join('|')})\\b`, lang === 'sql' ? 'gi' : 'g')
	const tokens = []
	let last = 0
	for (const match of code.matchAll(pattern)) {
		if (match.index > last) tokens.push({type: 'plain', text: code.slice(last, match.index)})
		const type = match[1] ? 'comment' : match[2] ? 'string' : match[3] ? 'number' : 'keyword'
		tokens.push({type, text: match[0]})
		last = match.index + match[0].length
	}
	if (last < code.length) tokens.push({type: 'plain', text: code.slice(last)})
	return tokens
}
