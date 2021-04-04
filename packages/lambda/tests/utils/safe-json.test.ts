import { describe, it, expect } from '@jest/globals'
import { safeParse, safeStringify } from '../../src/utils/safe-json'

describe('Json issues when a function call return +/- Infinity number', () => {
  const obj = { a: NaN, b: -Infinity, c: Infinity }
  const text = '{"a":"NaN","b":"-Infinity","c":"Infinity"}'

  it('Safe stringify', () => {
    expect(safeStringify(obj)).toEqual(text)
  })

  it('Safe parse', () => {
    expect(safeParse(text)).toEqual(obj)
  })
})
