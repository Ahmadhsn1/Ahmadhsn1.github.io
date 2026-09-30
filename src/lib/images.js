import {imageSizes} from '@/lib/image-sizes.js'

// Content refers to screenshots by their original path (e.g. /images/projects/x/y.jpg).
// This maps that path onto the WebP variants that actually ship, so every <img> gets a srcset.
export function responsiveImage(path) {
	const base = path.replace(/\.(jpe?g|png)$/i, '')
	const widths = imageSizes[base]
	if (!widths) return {src: path}
	return {
		src: `${base}-${widths[widths.length - 1]}.webp`,
		srcSet: widths.map((width) => `${base}-${width}.webp ${width}w`).join(', '),
	}
}
