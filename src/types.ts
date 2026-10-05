/** Pixel amostrado: [r, g, b], cada canal de 0 a 255 */
export type Pixel = [r: number, g: number, b: number]

/** Cor média de um grupo de pixels; n = quantidade de pixels no grupo */
export interface ColorBucket {
	r: number
	g: number
	b: number
	n: number
}

/** Cor pronta para exibição na paleta */
export interface PaletteColor {
	hex: string
	/** cor do texto sobre o fundo (preto ou branco) */
	fg: string
	/** participação na imagem, ex.: "42%" ou "<1%" */
	pct: string
}

export interface AppState {
	src: string | null
	fileName: string
	colors: PaletteColor[]
}
