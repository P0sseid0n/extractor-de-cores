import './styles/base.css'
import './styles/layout.css'
import './styles/components/button.css'
import './styles/components/dropzone.css'
import './styles/components/palette.css'

import { COPY_FEEDBACK_MS } from './config.ts'
import type { AppState } from './types.ts'
import { buildPalette } from './core/palette.ts'
import { isImageFile, readAsDataURL, loadImage, samplePixels } from './services/image-loader.ts'
import { writeClipboard } from './services/clipboard.ts'
import { els, setStatus } from './ui/dom.ts'
import { initDropzone, showPreview } from './ui/dropzone.ts'
import { renderSlots, renderColors, setExtracting } from './ui/palette-view.ts'

let state: AppState = { src: null, fileName: '', colors: [] }
let feedbackTimer: ReturnType<typeof setTimeout> | undefined

const COPY_ALL_LABEL = 'Copiar todos'

function render(copiedHex: string | null = null): void {
	renderColors(state.colors, { onCopy: copyColor, copiedHex })
}

async function handleFile(file: File | undefined): Promise<void> {
	if (!file) return
	if (!isImageFile(file)) {
		setStatus('Esse arquivo não é uma imagem. Envie JPG, PNG, WEBP ou GIF.')
		return
	}
	try {
		const src = await readAsDataURL(file)
		state = { src, fileName: file.name, colors: [] }
		showPreview(src)
		els.extractBtn.disabled = false
		renderSlots()
		setStatus(file.name + ' — pronto para extrair')
	} catch {
		setStatus('Não foi possível ler a imagem.')
	}
}

async function extract(): Promise<void> {
	if (!state.src) return
	setExtracting(true)
	setStatus('Analisando pixels…')
	let img: HTMLImageElement
	try {
		img = await loadImage(state.src)
	} catch {
		setExtracting(false)
		setStatus('Não foi possível abrir essa imagem.')
		return
	}
	const px = samplePixels(img)
	setExtracting(false)
	if (!px.length) {
		setStatus('A imagem não tem pixels visíveis.')
		return
	}

	state.colors = buildPalette(px)
	render()
	setStatus(state.colors.length + ' cores extraídas de ' + state.fileName + ' — clique numa cor para copiar')
}

// Copia o texto e mostra "Copiado!" no alvo por alguns instantes
async function copyWithFeedback(text: string, showFeedback: () => void): Promise<void> {
	const ok = await writeClipboard(text)

	if (!ok) {
		setStatus('Não foi possível copiar. Copie manualmente: ' + text)
		return
	}

	clearTimeout(feedbackTimer)
	render()

	els.copyAllBtn.textContent = COPY_ALL_LABEL

	showFeedback()

	feedbackTimer = setTimeout(() => {
		render()
		els.copyAllBtn.textContent = COPY_ALL_LABEL
	}, COPY_FEEDBACK_MS)
}

const copyColor = (hex: string) => copyWithFeedback(hex, () => render(hex))

const copyAll = () =>
	copyWithFeedback(state.colors.map(c => c.hex).join(', '), () => {
		els.copyAllBtn.textContent = 'Copiado!'
	})

initDropzone(handleFile)
els.extractBtn.addEventListener('click', extract)
els.copyAllBtn.addEventListener('click', copyAll)
renderSlots()
