import { describe, expect, test } from '@jest/globals'
import { TreeError } from '../../src/errors/tree'
import buildRunner from '../../src/runner'
import { FunctionData, SupportedLanguages } from '../../src/types'

describe('lang: `python`', () => {
  const run = buildRunner('python', { memoize: false })

  test('when user input contains single quotes', async () => {
    const actual = await run({
      params: [{ name: 'str', initialValue: "'abc'" }],
      body: [
        "if str == '': return ''",
        'return fn(str[1:]) + str[0]',
      ].join('\n'),
    })
    expect(actual.isSuccess()).toBeTruthy()
  })

  describe('when user input contains double quotes', () => {
    test('only on params.initialValue', async () => {
      const actual = await run({
        params: [{ name: 'str', initialValue: '"abc"' }],
        body: [
          "if str == '': return ''",
          'return fn(str[1:]) + str[0]',
        ].join('\n'),
      })
      expect(actual.isSuccess()).toBeTruthy()
    })
    test('only on body', async () => {
      const actual = await run({
        params: [{ name: 'str', initialValue: "'abc'" }],
        body: [
          'if str == \'\': return \"\"',
          'return fn(str[1:]) + str[0]',
        ].join('\n'),
      })
      expect(actual.isSuccess()).toBeTruthy()
    })
  })

  test('when memoize is enabled', async () => {
    const fnData: FunctionData = {
      params: [
        { name: 'n', initialValue: '5' },
        { name: 'k', initialValue: '2' },
      ],
      body: [
        'if (k == 0 or n == k): return 1',
        'return fn(n-1, k-1) + fn(n-1, k)',
      ].join('\n'),
    }

    compareWithAndWithoutMemoize('python', fnData)
  })

  test('when function return have multiple types', async () => {
    const actual = await run({
      globalVariables: [
        { name: 'steps', value: '3' },
        { name: 'arrLen', value: '2' },
      ],
      params: [
        { name: 'idx', initialValue: '0' },
        { name: 'step', initialValue: 'steps' },
      ],
      body: [
        'if idx < 0 or idx >= arrLen:',
        '    return 0',
        'if 0 == step:',
        '    return 0 == idx',
        'return (fn(idx - 1, step - 1) + fn(idx + 1, step - 1) + fn(idx, step - 1)) % 1000000007',
      ].join('\n'),
    })
    expect(actual.isSuccess()).toBeTruthy()
  })

  describe('when exceed max recursive calls', () => {
    test('and there is not algebraic operation with function return value', async () => {
      const actual = await run({
        body: 'return fn()',
      })
      expect(actual.isError()).toBeTruthy()
      if (actual.isError())
        expect(actual.value.type).toEqual(TreeError.ExceededRecursiveCallsLimit)
    })


    test('and there is some algebraic operation with function return value', async () => {
      const actual = await run({
        body: 'return 1 + fn()',
      })
      expect(actual.isError()).toBeTruthy()
      if (actual.isError())
        expect(actual.value.type).toEqual(TreeError.ExceededRecursiveCallsLimit)
    })
  })
})

describe('lang: `node`', () => {
  const run = buildRunner('node', { memoize: false })

  test('when user input contains single quotes', async () => {
    const actual = await run({
      params: [{ name: 'str', initialValue: "'abc'" }],
      body: [
        "if (str === '') return ''",
        'return fn(str.substr(1, str.length)) + str[0]',
      ].join('\n'),
    })
    expect(actual.isSuccess()).toBeTruthy()
  })

  describe('when user input contains double quotes', () => {
    test('only on params.initialValue', async () => {
      const actual = await run({
        params: [{ name: 'str', initialValue: '"abc"' }],
        body: [
          "if (str === '') return ''",
          'return fn(str.substr(1, str.length)) + str[0]',
        ].join('\n'),
      })
      expect(actual.isSuccess()).toBeTruthy()
    })
    test('only on body', async () => {
      const actual = await run({
        params: [{ name: 'str', initialValue: "'abc'" }],
        body: [
          'if (str === \'\') return \"\"',
          'return fn(str.substr(1, str.length)) + str[0]',
        ].join('\n'),
      })
      expect(actual.isSuccess()).toBeTruthy()
    })
  })

  test('when memoize is enabled', async () => {
    const fnData: FunctionData = {
      params: [
        { name: 'n', initialValue: '5' },
        { name: 'k', initialValue: '2' },
      ],
      body: [
        'if (k == 0 || n == k) return 1',
        'return fn(n-1, k-1) + fn(n-1, k)',
      ].join('\n'),
    }

    compareWithAndWithoutMemoize('node', fnData)
  })

  test('when function return can be `Infinity`', async () => {
    const actual = await run({
      globalVariables: [{ name: 'coins', value: '[1,3,4,5]' }],
      params: [{ name: 'v', initialValue: '5' }],
      body: [
        'if (v == 0) return 0',
        'if (v < 0) return Infinity',
        '',
        'let ans = Infinity',
        'for (const coin of coins)',
        '  ans = Math.min(',
        '    ans,',
        '    1 + fn(v - coin)',
        '  )',
        'return ans',
      ].join('\n'),
    })
    expect(actual.isSuccess()).toBeTruthy()
  })

  describe('when exceed max recursive calls', () => {
    test('and there is not algebraic operation with function return value', async () => {
      const actual = await run({
        body: 'return fn()',
      })
      expect(actual.isError()).toBeTruthy()
      if (actual.isError())
        expect(actual.value.type).toEqual(TreeError.ExceededRecursiveCallsLimit)
    })

    test('and there is some algebraic operation with function return value', async () => {
      const actual = await run({
        body: 'return 1 + fn()',
      })
      expect(actual.isError()).toBeTruthy()
      if (actual.isError())
        expect(actual.value.type).toEqual(TreeError.ExceededRecursiveCallsLimit)
    })
  })
})

async function compareWithAndWithoutMemoize(lang: SupportedLanguages, fnData: FunctionData) {
  const runWithMemo = buildRunner(lang, { memoize: true })
  const runWithoutMemo = buildRunner(lang, { memoize: false })

  const resultWithMemoize = await runWithMemo(fnData)
  expect(resultWithMemoize.isSuccess()).toBeTruthy()

  const resultWithoutMemoize = await runWithoutMemo(fnData)
  expect(resultWithoutMemoize.isSuccess()).toBeTruthy()

  if (resultWithoutMemoize.isSuccess() && resultWithMemoize.isSuccess())
    expect(resultWithoutMemoize.value.times).toBeGreaterThan(resultWithMemoize.value.times)
}