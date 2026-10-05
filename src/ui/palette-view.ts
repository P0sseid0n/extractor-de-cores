import { COLOR_COUNT } from '../config.ts'
import type { PaletteColor } from '../types.ts'
import { els } from './dom.ts'

interface RenderOptions {
	onCopy?: (hex: string) => void
	/** cor que deve exibir "Copiado!" no lugar do HEX */
	copiedHex?: string | null
}

// Placeholders tracejados exibidos antes da extração
export function renderSlots(count: number = COLOR_COUNT): void {
	els.palette.innerHTML = ''

	for (let i = 0; i < count; i++) {
		const d = document.createElement('div')
		d.className = 'slot'
		d.setAttribute('aria-hidden', 'true')
		els.palette.appendChild(d)
	}

	els.copyAllBtn.hidden = true
}

export function renderColors(colors: PaletteColor[], { onCopy, copiedHex = null }: RenderOptions = {}): void {
	els.palette.innerHTML = ''
	colors.forEach(c => {
		const b = document.createElement('button')
		b.type = 'button'
		b.className = 'swatch'
		b.style.background = c.hex
		b.style.color = c.fg
		b.title = 'Clique para copiar'
		b.setAttribute('aria-label', 'Copiar ' + c.hex)
		b.innerHTML =
			'<span class="hex">' + (c.hex === copiedHex ? 'Copiado!' : c.hex) + '</span><span class="pct hide-sm">' + c.pct + '</span>'
		b.addEventListener('click', () => onCopy?.(c.hex))
		els.palette.appendChild(b)
	})
	els.copyAllBtn.hidden = colors.length === 0
}

export function setExtracting(busy: boolean): void {
	els.extractBtn.disabled = busy
	els.extractBtn.textContent = busy ? 'Extraindo…' : 'Extrair cores'
}
