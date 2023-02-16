import { defineConfig } from 'tsup'

export default defineConfig({
  name: 'archergu-ts-lib',
  entry: ['src/index.ts'],
  dts: {
    resolve: true,
    entry: 'src/index.ts',
  },
  clean: true,
  splitting: true
})
