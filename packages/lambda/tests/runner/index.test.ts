import { describe, test, expect } from '@jest/globals'
import buildRunner from '../../src/runner'
import { supportedLanguages } from '../../src/settings'
import { FunctionData, SupportedLanguages } from '../../src/types'
import { debug } from 'debug'
const log = debug('test:runner')

const testCase: Record<SupportedLanguages, FunctionData> = {
  node: {
    params: [
      { name: 'n', initialValue: '5' },
      { name: 'k', initialValue: '2' },
    ],
    body: [
      'if (k == 0 || n == k) return 1',
      'return fn(n-1, k-1) + fn(n-1, k)',
    ].join('\n'),
  },
  python: {
    params: [
      { name: 'n', initialValue: '5' },
      { name: 'k', initialValue: '2' },
    ],
    body: [
      'if (k == 0 or n == k): return 1',
      'return fn(n-1, k-1) + fn(n-1, k)',
    ].join('\n'),
  },
}

describe('Getting tree viewer data from function data', () => {
  describe('The memoize option should works', () => {
    test.each(supportedLanguages.map((l) => [l]))(
      'For `%s` language',
      async (lang: SupportedLanguages) => {
        const runWithMemoize = buildRunner(lang, { memoize: true })
        const resultWithMemoize = await runWithMemoize(testCase[lang])
        if (resultWithMemoize.isError()) log(resultWithMemoize.value)
        expect(resultWithMemoize.isSuccess()).toBeTruthy()

        const runWithoutMemoize = buildRunner(lang, { memoize: false })
        const resultWithoutMemoize = await runWithoutMemoize(testCase[lang])
        if (resultWithoutMemoize.isError()) log(resultWithoutMemoize.value)
        expect(resultWithoutMemoize.isSuccess()).toBeTruthy()

        if (resultWithoutMemoize.isSuccess() && resultWithMemoize.isSuccess())
          expect(resultWithoutMemoize.value.times > resultWithMemoize.value.times).toBeTruthy()
      }
    )
  })
  describe('The full pipeline should run successfully', () => {
    test('For `node` language', async () => {
      const run = buildRunner('node', { memoize: true })
      const treeViewerData = await run({
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
      expect(treeViewerData.isSuccess()).toBeTruthy()
      // if (treeViewerData.isSuccess())
      //    log(treeViewerData.value?.logs)
    })
  })
  describe('Should be acceptable a function with different return types', () => {
    test('For `python` language', async () => {
      const run = buildRunner('python', { memoize: false })
      const treeViewerData = await run({
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
          'return(fn(idx - 1, step - 1) + fn(idx + 1, step - 1) + fn(idx, step - 1)) % 1000000007',
        ].join('\n')
      })
      expect(treeViewerData.isSuccess()).toBeTruthy()
      // if (treeViewerData.isSuccess())
      //    log(treeViewerData.value)
    })
  })
})
