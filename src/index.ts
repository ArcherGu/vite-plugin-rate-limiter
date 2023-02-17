import { Throttle } from 'stream-throttle'
import type { Plugin } from 'vite'
import { createFilter } from 'vite'

export interface MatchOptions {
  /**
   * Match options.
   */
  match: string | RegExp | (string | RegExp)[]
  /**
   * Specify file rate in kb/s.
   */
  rate?: number
}

export interface ViteRateLimiterOptions {
  /**
   * The rate of the stream in kb/s.
   */
  rate: number
  /**
   * The match options. if not set, plugin will not work.
   * Prioritize matching low rates
   */
  matchOpts?: string | RegExp | MatchOptions | (string | RegExp | MatchOptions)[]
}

interface LimiterSetting {
  rate: number
  filter: (id: string) => boolean
}

export function ViteRateLimiter(options: ViteRateLimiterOptions): Plugin {
  const { rate: defaultRate, matchOpts: _matchOpts } = options
  const matchOpts = Array.isArray(_matchOpts) ? _matchOpts : _matchOpts ? [_matchOpts] : []

  // if not set, plugin will not work.
  if (!defaultRate || defaultRate <= 0 || matchOpts.length === 0) {
    return {
      name: 'vite-rate-limiter',
      configureServer() { },
    }
  }

  const matchRecords: Record<number, Set<(string | RegExp)>> = {}
  for (const matchOpt of matchOpts) {
    if (typeof matchOpt === 'string' || matchOpt instanceof RegExp) {
      matchRecords[defaultRate] = matchRecords[defaultRate] || new Set()
      matchRecords[defaultRate].add(matchOpt)
    }
    else {
      const { match, rate = defaultRate } = matchOpt
      const arrMatch = Array.isArray(match) ? match : [match]
      matchRecords[rate] = matchRecords[rate] || new Set()
      arrMatch.forEach(m => matchRecords[rate].add(m))
    }
  }

  const limiterSettings: LimiterSetting[] = []
  for (const rate in matchRecords) {
    limiterSettings.push({
      rate: Number(rate),
      filter: createFilter(Array.from(matchRecords[Number(rate)])),
    })
  }
  limiterSettings.sort((a, b) => a.rate - b.rate)

  return {
    name: 'vite-rate-limiter',
    configureServer(server) {
      server.middlewares.use(async (req, res: any, next) => {
        let throttle: Throttle | undefined
        for (const limiterSetting of limiterSettings) {
          if (limiterSetting.filter(req.url || '')) {
            throttle = new Throttle({ rate: limiterSetting.rate * 1024 })
            break
          }
        }

        if (throttle) {
          const { end: resEnd, write: resWrite, on: resOn } = res

          // replace write and end
          res.write = function (...args: any[]) {
            return throttle!.write.apply(throttle, args as any)
          }
          res.end = function (...args: any[]) {
            return throttle!.end.apply(throttle, args as any)
          }

          // end
          throttle.on('end', () => {
            return resEnd.call(res)
          })

          // backpressure
          throttle.on(
            'data',
            chunk => resWrite.call(res, chunk) === false && throttle!.pause(),
          )
          resOn.call(res, 'drain', () => throttle!.resume())

          res.on = function (type, listener) {
            if (type !== 'drain')
              resOn.call(this, type, listener)

            else
              throttle!.on(type, listener)

            return this
          }
        }

        next()
      })
    },
  }
}
