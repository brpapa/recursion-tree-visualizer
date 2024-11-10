import { describe, expect, it } from '@jest/globals'
import {
  extractCallingValues,
  ExtractedParam,
  extractParams,
  extractStringBetweenFirstParentesis,
  ParamExtractMode
} from './extractors'

describe('extractParams', () => {
  describe('when mode is `NEVER_TYPE_AND_MAYBE_DEFAULT`', () => {
    const test = createTest('NEVER_TYPE_AND_MAYBE_DEFAULT')

    test('', [])
    test(' ', [])
    test('a', [{ name: 'a', type: null, default: null }])
    test('a= 1 , b ', [
      { name: 'a', type: null, default: '1' },
      { name: 'b', type: null, default: null },
    ])
    test('a,b', [
      { name: 'a', type: null, default: null },
      { name: 'b', type: null, default: null },
    ])
    test('a, b=2', [
      { name: 'a', type: null, default: null },
      { name: 'b', type: null, default: '2' },
    ])
    test('a=1, b', [
      { name: 'a', type: null, default: '1' },
      { name: 'b', type: null, default: null },
    ])
    test('a="s"', [{ name: 'a', type: null, default: '"s"' }])
    test('a, b=[0,1]', [
      { name: 'a', type: null, default: null },
      { name: 'b', type: null, default: '[0,1]' },
    ])
    test('a=[0,1], b', [
      { name: 'a', type: null, default: '[0,1]' },
      { name: 'b', type: null, default: null },
    ])
    test('a=(0,1), b, c=[2,3], d', [
      { name: 'a', type: null, default: '(0,1)' },
      { name: 'b', type: null, default: null },
      { name: 'c', type: null, default: '[2,3]' },
      { name: 'd', type: null, default: null },
    ])
    test('a=[{"a":1,"b":2}, 1], b', [
      { name: 'a', type: null, default: '[{"a":1,"b":2}, 1]' },
      { name: 'b', type: null, default: null },
    ])
  })

  describe('when mode is `ALWAYS_TYPE_AFTER_NAME_AND_NEVER_DEFAULT`', () => {
    const test = createTest('ALWAYS_TYPE_AFTER_NAME_AND_NEVER_DEFAULT')
    test('', [])
    test(' ', [])
    test('a boolean', [{ name: 'a', type: 'boolean', default: null }])
    test('a string, b int', [
      { name: 'a', type: 'string', default: null },
      { name: 'b', type: 'int', default: null },
    ])
  })

  function createTest(mode: ParamExtractMode) {
    return (arg: string, expected: ExtractedParam[]) => {
      it(`given ${JSON.stringify(arg)} should return ${JSON.stringify(
        expected
      )}`, () => {
        const actual = extractParams(arg, mode)
        expect(actual).toEqual(expected)
      })
    }
  }
})

describe('extractCallingValues', () => {
  test('', [])
  test(' ', [])
  test('(1,2)', ['(1,2)'])
  test('[1,2]', ['[1,2]'])
  test('{"a":1,"b":2}', ['{"a":1,"b":2}'])
  test('[1,2], [1]', ['[1,2]', '[1]'])
  test('[1,[2,3]], 1', ['[1,[2,3]]', '1'])
  test('[1,[2,3]], {"a":1}, (1)', ['[1,[2,3]]', '{"a":1}', '(1)'])

  function test(arg: string, expected: string[]) {
    it(`given ${JSON.stringify(arg)} should return ${JSON.stringify(
      expected
    )}`, () => {
      const actual = extractCallingValues(arg)
      expect(actual).toEqual(expected)
    })
  }
})

describe('extractStringBetweenFirstParentesis', () => {
  test('xxx(x())', 'x()')
  test('x((())())x', '(())()')
  test('((())())', '(())()')
  test('(x())()', 'x()')

  function test(arg: string, expected: string) {
    it(`given ${JSON.stringify(arg)} should return ${JSON.stringify(
      expected
    )}`, () => {
      const actual = extractStringBetweenFirstParentesis(arg)
      expect(actual).toEqual(expected)
    })
  }
})
