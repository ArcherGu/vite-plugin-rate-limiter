import { describe, expect, it } from 'vitest'
import { add } from '../src'

describe('Rollback', () => {
  it('should do addition', () => {
    expect(add(1, 2)).toBe(3)
  })
})