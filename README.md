# 🚰 vite-plugin-rate-limiter

[![npm version](https://badgen.net/npm/v/vite-plugin-rate-limiter)](https://npm.im/vite-plugin-rate-limiter) [![npm downloads](https://badgen.net/npm/dm/vite-plugin-rate-limiter)](https://npm.im/vite-plugin-rate-limiter)

A vite plugin to limit the speed of specific files from ViteDevServer to your browser in development mode.

## Install

```bash
# npm
npm i vite-plugin-rate-limiter -D

# yarn
yarn add vite-plugin-rate-limiter -D

# pnpm
pnpm add vite-plugin-rate-limiter -D
```

## Usage

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { ViteRateLimiter } from 'vite-plugin-rate-limiter'

export default defineConfig({
  plugins: [
    ViteRateLimiter({
      rate: 100, // 100 kb/s
      matchOpts: '**/*.glb'
    }),
  ]
})
```

## Why?

Sometimes we need to simulate poor network environments, but damn local development server is so fast, now you can limit the speed of specific files to your browser in development mode with this plugin. 🐢 

## License

MIT License © 2022 [Archer Gu](https://github.com/archergu)
