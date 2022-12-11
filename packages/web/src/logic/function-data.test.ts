import { describe, expect, it } from '@jest/globals'
import { DecomposedFunctionData, FunctionData, Language } from '../types'
import {
  composeFnData,
  extractCallingValues,
  extractParams,
  extractStringBetweenFirstParentesis,
  decomposeFnData,
  ExtractedParam,
  ParamExtractMode,
} from './function-data'

let tc = 1

describe('when some function param has a default value', () => {
  describe('should compose function data', () => {
    describe('when lang is `node`', () => {
      test(
        'node',
        {
          fnCode: 'function fn(a="1", b="2") { return 1 }',
          fnCall: 'fn()',
        },
        {
          params: [
            { name: 'a', initialValue: '"1"' },
            { name: 'b', initialValue: '"2"' },
          ],
        }
      )

      test(
        'node',
        {
          fnCode: 'function fn(a, b=2) { return 1 }',
          fnCall: 'fn(1)',
        },
        {
          params: [
            { name: 'a', initialValue: '1' },
            { name: 'b', initialValue: '2' },
          ],
        }
      )

      test(
        'node',
        {
          fnCode: 'function fn(a=0, b) { return 1 }',
          fnCall: 'fn(1,2)',
        },
        {
          params: [
            { name: 'a', initialValue: '1' },
            { name: 'b', initialValue: '2' },
          ],
        }
      )

      test(
        'node',
        {
          fnCode: 'function fn(a, b=[0,1]) { return 1 }',
          fnCall: 'fn(1)',
        },
        {
          params: [
            { name: 'a', initialValue: '1' },
            { name: 'b', initialValue: '[0,1]' },
          ],
        }
      )
    })
    describe('when lang is `python`', () => {
      test(
        'python',
        {
          fnCode: 'def fn(a, b=(1,2)):\n\t return 1',
          fnCall: 'fn(0)',
        },
        {
          params: [
            { name: 'a', initialValue: '0' },
            { name: 'b', initialValue: '(1,2)' },
          ],
        }
      )
    })

    function test(
      lang: Language,
      decomposedFnData: Pick<DecomposedFunctionData, 'fnCode' | 'fnCall'>,
      expectedComposed: Pick<FunctionData, 'params'>
    ) {
      it(`case ${tc++}`, () => {
        const actualComposed = composeFnData(
          { ...decomposedFnData, fnGlobalVars: [] },
          lang
        )
        expect(actualComposed.params).toEqual(expectedComposed.params)
      })
    }
  })
})

describe('when no function param has a default value', () => {
  describe('should compose and decompose function data bidirectionally', () => {
    describe('when function has two params', () => {
      describe('when lang is `node`', () => {
        test(
          'node',
          {
            fnCode: 'function fn(a, b) { return 1 }',
            fnCall: 'fn("1", "2")',
          },
          {
            body: 'return 1',
            params: [
              { name: 'a', initialValue: '"1"' },
              { name: 'b', initialValue: '"2"' },
            ],
          }
        )
      })
      describe('when lang is `python`', () => {
        test(
          'python',
          {
            fnCode: 'def fn(a, b):\n\t return 1',
            fnCall: 'fn("1", "2")',
          },
          {
            body: 'return 1',
            params: [
              { name: 'a', initialValue: '"1"' },
              { name: 'b', initialValue: '"2"' },
            ],
          }
        )
      })
      describe('when lang is `golang`', () => {
        test(
          'golang',
          {
            fnCode: 'func fn(a string, b string) int { return 1 }',
            fnCall: 'fn("1", "2")',
          },
          {
            body: 'return 1',
            returnType: 'int',
            params: [
              { name: 'a', type: 'string', initialValue: '"1"' },
              { name: 'b', type: 'string', initialValue: '"2"' },
            ],
          }
        )
      })
    })
    describe('when there is a nested function', () => {
      describe('when lang is `node`', () => {
        test(
          'node',
          {
            fnCode: 'function fn() { function f() { return 1 }; return f(); }',
            fnCall: 'fn()',
          },
          {
            body: 'function f() { return 1 }; return f();',
            params: [],
          }
        )
      })
      describe('when lang is `python`', () => {
        test(
          'python',
          {
            fnCode: 'def fn():\n\tdef f():\n\t\treturn 1\n\treturn f()',
            fnCall: 'fn()',
          },
          {
            body: 'def f():\n\t\treturn 1\n\treturn f()',
            params: [],
          }
        )
      })
      describe('when lang is `golang`', () => {
        test(
          'golang',
          {
            fnCode: 'func fn() int { func f() int { return 1 }; return f(); }',
            fnCall: 'fn()',
          },
          {
            body: 'func f() int { return 1 }; return f();',
            returnType: 'int',
            params: [],
          }
        )
      })
    })

    function test(
      lang: Language,
      decomposedFnData: Omit<DecomposedFunctionData, 'fnGlobalVars'>,
      composedFnData: Omit<FunctionData, 'globalVariables'>
    ) {
      describe(`case ${tc++}`, () => {
        it('should compose given decomposed', () => {
          const actualComposed = composeFnData(
            { ...decomposedFnData, fnGlobalVars: [] },
            lang
          )
          expectBeEqualIgnoringWhitespaces(
            actualComposed.body,
            composedFnData.body
          )
          expect(actualComposed.params).toEqual(composedFnData.params)
          expect(actualComposed.returnType).toEqual(composedFnData.returnType)
        })
        it('should decompose given composed', () => {
          const actualDecomposed = decomposeFnData(
            { ...composedFnData, globalVariables: [] },
            lang
          )
          expectBeEqualIgnoringWhitespaces(
            actualDecomposed.fnCode,
            decomposedFnData.fnCode
          )
          expect(actualDecomposed.fnCall).toEqual(decomposedFnData.fnCall)
        })
      })
    }
  })
})

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

function expectBeEqualIgnoringWhitespaces(a: string, b: string) {
  const regexp = /\s/g
  expect(a.replace(regexp, '')).toEqual(b.replace(regexp, ''))
}
