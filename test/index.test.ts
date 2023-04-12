import { Writable } from 'node:stream'
import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { ViteRateLimiter } from '../src'

// to save promise resolve function
let waitResolve: Function
function wait() {
  return new Promise((resolve) => {
    waitResolve = resolve
  })
}

// mock writeable stream: res
class ResWriteable extends Writable {
  _write(chunk: any, encoding: string, callback: Function) {
    callback()
  }

  _final() {
    waitResolve()
  }
}

type ServerMiddlewaresUseFn = (req: { url: string }, res: Writable, next: () => void) => void

// mock server
const server = {
  middlewares: {
    use: (fn: ServerMiddlewaresUseFn) => {
      const res = new ResWriteable()

      // set rate limiter for res
      fn({ url: 'test.txt' }, res, () => { })

      const filePath = path.resolve(__dirname, './test.txt')
      const readFileStream = fs.createReadStream(filePath)

      readFileStream.on('data', (chunk) => {
        res.write(chunk) === false && readFileStream.pause()
      })

      res.on('drain', () => {
        readFileStream.resume()
      })

      readFileStream.on('end', () => {
        res.end()
      })
    },
  },
}

describe('vite-rate-limiter', () => {
  it('should limit rate when match file', async () => {
    const { configureServer } = ViteRateLimiter({
      rate: 1,
      matchOpts: '**/*.txt',
    })

    expect(!!configureServer).toBe(true)

    const start = Date.now()
      ; (configureServer as any)(server)

    // wait for res.end()
    await wait()
    const end = Date.now()
    expect(end - start).toBeGreaterThan(5000)
  })

  it('should not limit rate when not match file', async () => {
    const { configureServer } = ViteRateLimiter({
      rate: 1,
      matchOpts: '**/*.js',
    })

    expect(!!configureServer).toBe(true)

    const start = Date.now()
      ; (configureServer as any)(server)

    // wait for res.end()
    await wait()
    const end = Date.now()
    expect(end - start).toBeLessThan(1000)
  })

  it('should not work when not set matchOpts', async () => {
    const { configureServer } = ViteRateLimiter({
      rate: 1,
    })

    expect(!!configureServer).toBe(false)
  })
})
