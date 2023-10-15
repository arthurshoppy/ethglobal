import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
// https://vitejs.dev/guide/env-and-mode.html
export default defineConfig({
  plugins: [
		nodePolyfills({
			include: ['stream'],
			
			globals: {
        Buffer: false, // can also be 'build', 'dev', or false
        global: true,
        process: true
      },

			protocolImports: false
		}),

		svelte()
	]
})
