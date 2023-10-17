import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
		nodePolyfills({
			include: [],
			
			globals: {
        Buffer: true, // 'build', 'dev', false
        global: true,
        process: true
      },

			protocolImports: false
		}),

		svelte()
	]
})
