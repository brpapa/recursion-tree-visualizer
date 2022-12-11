import { describe, expect, it } from '@jest/globals'
import { FunctionData, Language, UnparsedFunctionData } from '../types'
import { LanguageHandler } from './language-handler'

let tc = 1

describe('LanguageHandler.parseFunctionData & LanguageHandler.unparseFunctionData', () => {
  describe('when some function param has a default value', () => {
    describe('should parse function data', () => {
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
        unparsedFunction: Pick<UnparsedFunctionData, 'fnCode' | 'fnCall'>,
        expected: Pick<FunctionData, 'params'>
      ) {
        it(`case ${tc++}`, () => {
          const actualParsed = LanguageHandler.for(lang).parseFunctionData({
            ...unparsedFunction,
            fnGlobalVars: [],
          })
          expect(actualParsed.params).toEqual(expected.params)
        })
      }
    })
  })
  describe('when no function param has a default value', () => {
    describe('should parse and unparse function data bidirectionally', () => {
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
              fnCode:
                'function fn() { function f() { return 1 }; return f(); }',
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
              fnCode:
                'func fn() int { func f() int { return 1 }; return f(); }',
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
        unparsedFunction: Omit<UnparsedFunctionData, 'fnGlobalVars'>,
        parsedFunction: Omit<FunctionData, 'globalVariables'>
      ) {
        describe(`case ${tc++}`, () => {
          it('should parse given unparsed', () => {
            const actualParsed = LanguageHandler.for(lang).parseFunctionData({
              ...unparsedFunction,
              fnGlobalVars: [],
            })
            expectBeEqualIgnoringWhitespaces(
              actualParsed.body,
              parsedFunction.body
            )
            expect(actualParsed.params).toEqual(parsedFunction.params)
            expect(actualParsed.returnType).toEqual(parsedFunction.returnType)
          })
          it('should unparse given parsed', () => {
            const actualUnparsed = LanguageHandler.for(
              lang
            ).unparseFunctionData({ ...parsedFunction, globalVariables: [] })
            expectBeEqualIgnoringWhitespaces(
              actualUnparsed.fnCode,
              unparsedFunction.fnCode
            )
            expect(actualUnparsed.fnCall).toEqual(unparsedFunction.fnCall)
          })
        })
      }
    })
  })
})

describe('FunctionData.validateFunctionCode', () => {
  describe('when lang is `node`', () => {
    const test = createTest('node')

    test('function fn() {\n\n}', true)
    test('function fn() {\nabc,.{[()]}cba\n}', true)
    test('function fn(abc,.{[()]}cba) {\n\n}', true)

    test('function fn( {}', false)
    test('function fn) {}', false)
    test('function fn() {', false)
    test('function fn() }', false)
    test('function fn() {}', false)
    test('function fn() {\n}', false)
    test('function fn() {\nabc,.{[()]}cba}', false)
    test('function fn() {abc,.{[()]}cba\n}', false)
  })

  describe('when lang is `python`', () => {
    const test = createTest('python')

    test('def fn():\n', true)
    test('def fn():\nabc,.{[()]}cba', true)
    test('def fn(abc,.{[()]}cba):\n', true)

    test('def fn():', false)
    test('def fn(): \n', false)
    test('def fn(:\n', false)
    test('def fn):\n', false)
  })

  describe('when lang is `golang`', () => {
    const test = createTest('golang')

    test('func fn() abc {\n\n}', true)
    test('func fn() {\n\n}', true)
    test('func fn() abc {\nabc,.{[()]}cba\n}', true)
    test('func fn(abc,.{[()]}cba) abc {\n\n}', true)

    test('func fn( {}', false)
    test('func fn) {}', false)
    test('func fn() {', false)
    test('func fn() }', false)
    test('func fn() {}', false)
    test('func fn() {\n}', false)
    test('func fn() {\nabc,.{[()]}cba}', false)
    test('func fn() {abc,.{[()]}cba\n}', false)
  })

  function createTest(lang: Language) {
    return (arg: string, expected: boolean) => {
      it(`given ${JSON.stringify(arg)} should return ${expected}`, () => {
        const actual = LanguageHandler.for(lang).validateFunctionCode(arg)
        expect(actual).toEqual(expected)
      })
    }
  }
})

describe('LanguageHandler.validateFunctionCall', () => {
  test('fn()', true)
  test('fn(abc,.{[()]}cba)', true)

  test('f()', false)
  test('n()', false)
  test('fn)', false)
  test('fn(', false)
  test('', false)

  function test(arg: string, expected: boolean) {
    it(`given ${JSON.stringify(arg)} should return ${expected}`, () => {
      const actual = LanguageHandler.validateFunctionCall(arg)
      expect(actual).toEqual(expected)
    })
  }
})

function expectBeEqualIgnoringWhitespaces(a: string, b: string) {
  const regexp = /\s/g
  expect(a.replace(regexp, '')).toEqual(b.replace(regexp, ''))
}
