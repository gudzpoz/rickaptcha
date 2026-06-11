import { defineConfig } from 'vite';

import dts from 'unplugin-dts/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

const BUILD_DOC = process.env.BUILD_DOC === 'true';

export default defineConfig(BUILD_DOC ? {
  plugins: [viteSingleFile()],
} : {
  build: {
    lib: {
      entry: 'src/lib.js',
      name: 'rickaptcha',
      fileName: 'rickaptcha',
			formats: ['es', 'umd'],
    },
  },
  plugins: [dts()],
});