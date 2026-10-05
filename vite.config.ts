import { defineConfig } from 'vite'

export default defineConfig({
	// Caminhos relativos: o site funciona tanto na raiz quanto em /extractor-de-cores/ (GitHub Pages)
	base: './',
	server: { open: true },
})
