import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'react-icons', 'framer-motion', 'next', 'react-tooltip'],
  treeshake: true,
  splitting: false,
  minify: false,
});
