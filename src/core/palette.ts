import { COLOR_COUNT, MERGE_DISTANCE } from '../config.ts'
import type { ColorBucket, PaletteColor, Pixel } from '../types.ts'
import { medianCut } from './median-cut.ts'
import { toHex, contrastText, rgbDistance } from './color-utils.ts'

// Recebe os pixels amostrados e devolve a paleta pronta para exibição,
// ordenada da cor mais presente para a menos presente.
export function buildPalette(px: Pixel[], count: number = COLOR_COUNT): PaletteColor[] {
	const merged: ColorBucket[] = []
	medianCut(px, count)
		.sort((a, b) => b.n - a.n)
		.forEach(c => {
			const dup = merged.find(o => rgbDistance(o, c) < MERGE_DISTANCE)
			if (dup) {
				dup.n += c.n
				return
			}
			merged.push({ ...c })
		})

	return merged.map(c => {
		const pct = Math.round((c.n / px.length) * 100)
		return {
			hex: toHex(c.r, c.g, c.b),
			fg: contrastText(c.r, c.g, c.b),
			pct: (pct < 1 ? '<1' : pct) + '%',
		}
	})
}
