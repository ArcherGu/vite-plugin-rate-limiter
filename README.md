# 🚰 vite-plugin-rate-limiter

[![npm](https://img.shields.io/npm/v/vite-plugin-rate-limiter?style=flat-square)](https://npm.im/vite-plugin-rate-limiter) [![npm](https://img.shields.io/npm/dw/vite-plugin-rate-limiter?style=flat-square)](https://npm.im/vite-plugin-rate-limiter) [![GitHub Workflow Status](https://img.shields.io/github/workflow/status/ArcherGu/vite-plugin-rate-limiter/CI?style=flat-square)](https://github.com/ArcherGu/vite-plugin-rate-limiter/actions/workflows/ci.yml)

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
