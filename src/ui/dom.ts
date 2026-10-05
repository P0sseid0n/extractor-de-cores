function $<T extends HTMLElement>(id: string): T {
	const el = document.getElementById(id)
	if (!el) throw new Error(`Elemento #${id} não encontrado`)
	return el as T
}

// Referências únicas aos elementos da página
export const els = {
	fileInput: $<HTMLInputElement>('file-input'),
	drop: $<HTMLElement>('drop'),
	empty: $<HTMLDivElement>('empty'),
	preview: $<HTMLImageElement>('preview'),
	swap: $<HTMLLabelElement>('swap'),
	extractBtn: $<HTMLButtonElement>('extract'),
	status: $<HTMLSpanElement>('status'),
	copyAllBtn: $<HTMLButtonElement>('copy-all'),
	palette: $<HTMLElement>('palette'),
}

export const setStatus = (text: string): void => {
	els.status.textContent = text
}
