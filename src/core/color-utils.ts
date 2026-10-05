type RGB = { r: number; g: number; b: number }

export const toHex = (r: number, g: number, b: number): string =>
	'#' +
	[r, g, b]
		.map(v => Math.round(v).toString(16).padStart(2, '0'))
		.join('')
		.toUpperCase()

export const luminance = (r: number, g: number, b: number): number => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255

// Cor de texto legível sobre o fundo informado
export const contrastText = (r: number, g: number, b: number): string => (luminance(r, g, b) > 0.55 ? '#111111' : '#FFFFFF')

export const rgbDistance = (a: RGB, b: RGB): number => Math.abs(a.r - b.r) + Math.abs(a.g - b.g) + Math.abs(a.b - b.b)
