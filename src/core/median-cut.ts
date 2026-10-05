import type { ColorBucket, Pixel } from '../types.ts'

type Channel = 0 | 1 | 2
const CHANNELS: Channel[] = [0, 1, 2]

// Quantização por median cut: divide repetidamente a "caixa" de pixels com maior
// amplitude (ponderada pelo tamanho) até chegar a n caixas, e retorna a média de cada uma.
export function medianCut(px: Pixel[], n: number): ColorBucket[] {
	const boxes: Pixel[][] = [px]
	while (boxes.length < n) {
		let bi = -1,
			best = 0
		let bch: Channel = 0
		boxes.forEach((b, i) => {
			if (b.length < 2) return
			for (const c of CHANNELS) {
				let mn = 255,
					mx = 0
				for (const p of b) {
					if (p[c] < mn) mn = p[c]
					if (p[c] > mx) mx = p[c]
				}
				const score = (mx - mn) * Math.sqrt(b.length)
				if (score > best) {
					best = score
					bi = i
					bch = c
				}
			}
		})
		if (bi < 0 || best === 0) break
		const box = boxes[bi].slice().sort((a, b) => a[bch] - b[bch])
		const mid = Math.floor(box.length / 2)
		boxes.splice(bi, 1, box.slice(0, mid), box.slice(mid))
	}
	return boxes.map(b => {
		let r = 0,
			g = 0,
			bl = 0
		for (const p of b) {
			r += p[0]
			g += p[1]
			bl += p[2]
		}
		return { r: r / b.length, g: g / b.length, b: bl / b.length, n: b.length }
	})
}
