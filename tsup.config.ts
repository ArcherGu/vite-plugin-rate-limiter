import { defineConfig } from 'tsup'

export default defineConfig({
  name: 'vite-rate-limiter',
  entry: ['src/index.ts'],
  dts: {
    resolve: true,
    entry: 'src/index.ts',
  },
  clean: true,
  splitting: true,
})
