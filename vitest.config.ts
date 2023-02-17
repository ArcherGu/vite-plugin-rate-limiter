import type { UserConfig } from 'vitest'

const config: { test: UserConfig } = {
  test: {
    testTimeout: 10 * 1000,
  },
}

export default config
