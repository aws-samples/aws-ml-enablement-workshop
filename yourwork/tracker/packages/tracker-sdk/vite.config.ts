import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MLEWTracker',
      formats: ['es', 'umd'],
      fileName: (format) => (format === 'umd' ? 'tracker-sdk.js' : 'tracker-sdk.es.js'),
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
    minify: 'esbuild',
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
