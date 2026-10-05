import { els } from './dom.ts'

// Liga o input de arquivo e o arrastar-e-soltar a um único callback
export function initDropzone(onFile: (file: File | undefined) => void): void {
	const { fileInput, drop } = els

	fileInput.addEventListener('change', () => {
		onFile(fileInput.files?.[0])
		fileInput.value = ''
	})

	;(['dragenter', 'dragover'] as const).forEach(ev =>
		drop.addEventListener(ev, e => {
			e.preventDefault()
			drop.classList.add('dragging')
		}),
	)
	drop.addEventListener('dragleave', e => {
		if (!drop.contains(e.relatedTarget as Node | null)) drop.classList.remove('dragging')
	})
	drop.addEventListener('drop', e => {
		e.preventDefault()
		drop.classList.remove('dragging')
		onFile(e.dataTransfer?.files[0])
	})
}

export function showPreview(src: string): void {
	els.preview.src = src
	els.preview.hidden = false
	els.swap.hidden = false
	els.empty.hidden = true
}
