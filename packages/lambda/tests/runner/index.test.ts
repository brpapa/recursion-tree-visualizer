import { describe, test, expect } from '@jest/globals'
import buildRunner from '../../src/runner'
import { FunctionData } from '../../src/types'

const bc: FunctionData = {
  params: [
    { name: 'n', initialValue: '5' },
    { name: 'k', initialValue: '2' },
  ],
  body: [
    'if (k == 0 || n == k) return 1',
    'return fn(n-1, k-1) + fn(n-1, k)',
  ].join('\n'),
}

describe('Getting tree viewer data from function data', () => {
  describe('For `node` language', () => {
    test('The memoize option should works', async () => {
      const noMemoizeResult = await buildRunner('node', { memoize: false })(bc)
      const withMemoizeResult = await buildRunner('node', { memoize: true })(bc)
      expect(noMemoizeResult.isSuccess()).toBeTruthy()
      expect(withMemoizeResult.isSuccess()).toBeTruthy()
      if (noMemoizeResult.isSuccess() && withMemoizeResult.isSuccess())
        expect(
          noMemoizeResult.value.times > withMemoizeResult.value.times
        ).toBeTruthy()
    })

    test('Coin change should be run sucessfully', async () => {
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
      //   console.log(treeViewerData.value?.logs)
    })
  })
})
