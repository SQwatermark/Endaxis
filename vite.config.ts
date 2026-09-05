/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';

import { configDefaults, defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  base: '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // Rebuilds create thousands of short-lived source, audit, and WebP files. They are loaded
    // explicitly by the compiler when needed; watching them only causes Windows directory locks
    // and unnecessary dev-server reload work.
    watch: { ignored: ['**/tmp/**'] },
  },
  test: {
    setupFiles: ['./src/test/prepareLocalization.ts'],
    // Rebuild/audit evidence belongs in the ignored temporary workspace and may
    // itself contain focused Vitest probes. It must never become part of the
    // repository test suite.
    exclude: [...configDefaults.exclude, 'tmp/**'],
  },
});
